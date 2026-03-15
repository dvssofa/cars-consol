# Управление консолью, Добрынина

- import inquirer from 'inquirer';

импорт библиотеки inquirer для создания интерактивного интерфейса

- type Car = {
    id: number;
    brand: string;
    model: string;
    year: number;
    used: boolean;
    price: number;
};

объявление типа для автомобиля с полями: ID, производитель, модель, год выпуска, состояние, цена

- let cars: Car[] = [];
let nextId: number = 1;

создание массива для хранения автомобилей и счетчик для генерации ID

- cars.push({ id: nextId++, brand: "Toyota", model: "Camry", year: 2022, used: false, price: 2500000 });

добавление тестовых автомобилей при запускеプログラム

- async function showMenu() {

главная функция, отображающая меню и обрабатывающая выбор пользователя

- const { action } = await inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'Выберите действие:',
        choices: [
            { name: '📋 Показать все машины', value: 'show' },
            { name: '➕ Добавить машину', value: 'add' },
            { name: '🔍 Найти машину по ID', value: 'find' },
            { name: '✏️ Обновить цену', value: 'update' },
            { name: '❌ Удалить машину', value: 'delete' },
            { name: '🚪 Выход', value: 'exit' }
        ]
    }
]);

создание интерактивного меню с выбором действия (list)

- switch (action) {
    case 'show':
        showAllCars();
        break;

переключение между выбранными действиями

- await showMenu();

рекурсивный вызов меню после выполнения действия (кроме выхода)

- function showAllCars() {

функция для отображения всех автомобилей

- cars.forEach(car => {
    const status = car.used ? 'Б/У' : 'Новая';
    console.log(`ID: ${car.id} | ${car.brand} ${car.model} | ${car.year} г. | ${status} | ${car.price.toLocaleString()} руб.`);
});

перебор и вывод каждого автомобиля с форматированием цены

- async function addCar() {

функция для добавления нового автомобиля с вводом данных

- const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'brand',
        message: 'Производитель:',
        validate: input => input ? true : 'Введите производителя'
    },

запрос производителя с валидацией (проверка на пустой ввод)

- {
    type: 'number',
    name: 'year',
    message: 'Год выпуска:',
    validate: input => input && input > 1900 && input <= 2026 ? true : 'Введите корректный год'
}

запрос года с валидацией (число от 1900 до 2026)

- {
    type: 'list',
    name: 'used',
    message: 'Состояние:',
    choices: [
        { name: 'Новая', value: false },
        { name: 'Б/У', value: true }
    ]
}

выбор состояния из двух вариантов (list)

- const newCar: Car = {
    id: nextId++,
    brand: answers.brand,
    model: answers.model,
    year: answers.year,
    used: answers.used,
    price: answers.price
};

создание объекта автомобиля из ответов пользователя

- async function findCar() {

функция для поиска автомобиля по ID

- const { id } = await inquirer.prompt([
    {
        type: 'number',
        name: 'id',
        message: 'Введите ID машины для поиска:',
        validate: input => input > 0 ? true : 'Введите корректный ID'
    }
]);

запрос ID для поиска с валидацией

- const car = cars.find(c => c.id === id);

поиск автомобиля по ID в массиве

- async function updateCar() {

функция для обновления цены автомобиля

- const carIndex = cars.findIndex(c => c.id === id);

поиск индекса автомобиля по ID

- cars[carIndex].price = newPrice;

обновление цены у найденного автомобиля

- async function deleteCar() {

функция для удаления автомобиля

- cars = cars.filter(c => c.id !== id);

фильтрация массива для удаления автомобиля с указанным ID

- console.log('🚗 ПРОГРАММА УПРАВЛЕНИЯ КАТАЛОГОМ МАШИН');
showMenu();

запуск программы и отображение главного меню
