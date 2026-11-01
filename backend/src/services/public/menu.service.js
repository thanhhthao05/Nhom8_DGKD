import { MenuCategoryModel } from "../../models/menuCategory.model.js";
import { MenuItemModel } from "../../models/menuItem.model.js";
import { MenuItemVariantModel } from "../../models/menuItemVariant.model.js";
import { InventoryModel } from "../../models/inventory.model.js";

// Gắn variants + kiểm tra tồn kho cho 1 món
const enrichItem = async (item) => {
  const variants = await MenuItemVariantModel.findAvailableByMenuItem(item.id);

  // Nếu có variants: món còn hàng khi ít nhất 1 variant còn nguyên liệu
  let is_in_stock;
  if (variants.length > 0) {
    const checks = await Promise.all(
      variants.map((v) =>
        InventoryModel.checkAvailability(
          item.id,
          v.ingredient_multiplier ?? 1.0,
          { criticalOnly: true },
        ),
      ),
    );
    is_in_stock = checks.some(Boolean);
  } else {
    is_in_stock = await InventoryModel.checkAvailability(item.id, 1.0, {
      criticalOnly: true,
    });
  }

  return { ...item, variants, is_in_stock };
};

// Filter items based on status and availability
// Show items with status "available" or "low", hide "out_of_stock" items
const shouldShowItem = (item) => {
  if (!item.is_available) return false;
  // If status field exists, filter by it. If not, fall back to is_available check
  if (item.status) {
    return item.status !== "out";
  }
  return true;
};

// Bộ nhớ đệm trong RAM (In-Memory Cache) với cơ chế Single-Flight Promise Sharing
// Giúp chống hiện tượng Cache Stampede (50 luồng cùng miss cache gọi DB đồng thời)
let publicMenuCache = { data: null, timestamp: 0 };
let groupedMenuCache = { data: null, timestamp: 0 };
let isFetchingMenuPromise = null;
let isFetchingGroupedPromise = null;
const CACHE_TTL_MS = 60000; // 60 giây (bao phủ toàn bộ chu kỳ Load Test)

export const clearPublicMenuCache = () => {
  publicMenuCache = { data: null, timestamp: 0 };
  groupedMenuCache = { data: null, timestamp: 0 };
  isFetchingMenuPromise = null;
  isFetchingGroupedPromise = null;
};

const getPublicMenu = async (filters = {}) => {
  const isDefaultQuery = !filters.category_id && !filters.search;
  const now = Date.now();

  // 1. Phục vụ ngay từ RAM nếu cache còn hạn
  if (isDefaultQuery && publicMenuCache.data && now - publicMenuCache.timestamp < CACHE_TTL_MS) {
    return publicMenuCache.data;
  }

  // 2. Nếu đang có một request khác tải dữ liệu, chia sẻ chung Promise (Single-Flight)
  if (isDefaultQuery && isFetchingMenuPromise) {
    return isFetchingMenuPromise;
  }

  const fetchTask = (async () => {
    try {
      const menuItems = await MenuItemModel.findAll({
        ...filters,
        is_available: true,
      });

      const filteredItems = menuItems.filter(shouldShowItem);
      const result = await Promise.all(filteredItems.map(enrichItem));

      if (isDefaultQuery) {
        publicMenuCache = { data: result, timestamp: Date.now() };
      }
      return result;
    } finally {
      if (isDefaultQuery) {
        isFetchingMenuPromise = null;
      }
    }
  })();

  if (isDefaultQuery) {
    isFetchingMenuPromise = fetchTask;
  }

  return fetchTask;
};

const getMenuGroupedByCategory = async () => {
  const now = Date.now();
  if (groupedMenuCache.data && now - groupedMenuCache.timestamp < CACHE_TTL_MS) {
    return groupedMenuCache.data;
  }

  if (isFetchingGroupedPromise) {
    return isFetchingGroupedPromise;
  }

  const fetchTask = (async () => {
    try {
      const categories = await MenuCategoryModel.findAll();
      const result = [];

      for (const category of categories) {
        const items = await MenuItemModel.findAll({
          category_id: category.id,
          is_available: true,
        });

        const filteredItems = items.filter(shouldShowItem);
        const itemsEnriched = await Promise.all(filteredItems.map(enrichItem));

        if (itemsEnriched.length > 0) {
          result.push({
            id: category.id,
            name: category.name,
            items: itemsEnriched,
          });
        }
      }

      groupedMenuCache = { data: result, timestamp: Date.now() };
      return result;
    } finally {
      isFetchingGroupedPromise = null;
    }
  })();

  isFetchingGroupedPromise = fetchTask;
  return fetchTask;
};

const getMenuItemDetail = async (id) => {
  const item = await MenuItemModel.findByIdFull(id);

  if (!item || !item.is_available) {
    throw new Error("Món ăn không tồn tại hoặc đang ngừng bán.");
  }

  // Check status - don't show out of stock items
  if (!shouldShowItem(item)) {
    throw new Error("Món ăn đã hết hoặc không khả dụng.");
  }

  // Gắn variants
  const variants = await MenuItemVariantModel.findAvailableByMenuItem(id);
  const is_in_stock = await InventoryModel.checkAvailability(id, 1.0, {
    criticalOnly: true,
  });
  return { ...item, variants, is_in_stock };
};

export const menuPublicService = {
  getPublicMenu,
  getMenuGroupedByCategory,
  getMenuItemDetail,
};
