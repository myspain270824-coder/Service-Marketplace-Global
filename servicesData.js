// servicesData.js
// Массив услуг для начального заполнения таблицы services

module.exports = [
  {
    subcategory_id: 4, // Создание сайтов
    name: 'Разработка простого сайта/лендинга',
    description: 'Одностраничный сайт для услуг или бизнеса, базовая SEO-настройка',
    contact: '+34624167087',
    base_price: 120,
    active: false
  },
  {
    subcategory_id: 3, // Генеральная уборка
    name: 'Глубокая уборка квартир',
    description: 'Генеральная уборка, мойка окон, кухня, санузлы',
    contact: '+34624167087',
    base_price: 18,
    active: false
  },
  {
    subcategory_id: 2, // Покраска и отделка
    name: 'Покраска стен и потолков',
    description: 'Подготовка поверхности, шпаклёвка, шлифовка, покраска в 2 слоя',
    contact: '+34624167087',
    base_price: 15,
    active: false
  },
  {
    subcategory_id: 1, // Ремонт ванных комнат
    name: 'Ремонт ванной под ключ',
    description: 'Комплексный ремонт санузла: от демонтажа до установки сантехники',
    contact: '+34624167087',
    base_price: 40,
    active: false
  },
  {
    subcategory_id: 1,
    name: 'Плитка и ремонт ванных комнат',
    description: 'Профессиональная укладка плитки, ремонт под ключ, демонтаж, гидроизоляция',
    contact: '+34624167087',
    base_price: 25,
    active: true
  }
];
