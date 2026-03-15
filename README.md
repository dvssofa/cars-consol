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

- cars.push({ id: nextId++, brand: "BMW", model: "X5", year: 2023, used: false, price: 5500000 });
cars.push({ id: nextId++, brand: "Mercedes", model: "E-Class", year: 2021, used: true, price: 3800000 });
cars.push({ id: nextId++, brand: "Audi", model: "Q7", year: 2022, used: false, price: 4900000 });

добавление тестовых автомобилей при запуске программы

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
    {
        type: 'input',
        name: 'model',
        message: 'Модель:',
        validate: input => input ? true : 'Введите модель'
    },
    {
        type: 'number',
        name: 'year',
        message: 'Год выпуска:',
        validate: input => input && input > 1900 && input <= 2026 ? true : 'Введите корректный год'
    },
    {
        type: 'list',
        name: 'used',
        message: 'Состояние:',
        choices: [
            { name: 'Новая', value: false },
            { name: 'Б/У', value: true }
        ]
    },
    {
        type: 'number',
        name: 'price',
        message: 'Цена:',
        validate: input => input && input > 0 ? true : 'Введите корректную цену'
    }
]);

запрос всех полей с валидацией

- const newCar: Car = {
    id: nextId++,
    brand: answers.brand,
    model: answers.model,
    year: answers.year,
    used: answers.used,
    price: answers.price
};

создание объекта автомобиля из ответов пользователя

- cars.push(newCar);
console.log('✅ Автомобиль успешно добавлен!');

добавление автомобиля в массив и подтверждение

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

- if (car) {
    const status = car.used ? 'Б/У' : 'Новая';
    console.log(`Найдено: ${car.brand} ${car.model} (${car.year}) | ${status} | ${car.price.toLocaleString()} руб.`);
} else {
    console.log('❌ Автомобиль с таким ID не найден');
}

вывод результата поиска или сообщение об ошибке

- async function updateCar() {

функция для обновления цены автомобиля

- const { id } = await inquirer.prompt([
    {
        type: 'number',
        name: 'id',
        message: 'Введите ID машины для обновления цены:',
        validate: input => input > 0 ? true : 'Введите корректный ID'
    }
]);

запрос ID для обновления

- const carIndex = cars.findIndex(c => c.id === id);

поиск индекса автомобиля по ID

- if (carIndex === -1) {
    console.log('❌ Автомобиль не найден');
    return;
}

проверка существования автомобиля

- const { newPrice } = await inquirer.prompt([
    {
        type: 'number',
        name: 'newPrice',
        message: 'Новая цена:',
        validate: input => input > 0 ? true : 'Введите корректную цену'
    }
]);

запрос новой цены с валидацией

- cars[carIndex].price = newPrice;
console.log('✅ Цена успешно обновлена!');

обновление цены у найденного автомобиля

- async function deleteCar() {

функция для удаления автомобиля

- const { id } = await inquirer.prompt([
    {
        type: 'number',
        name: 'id',
        message: 'Введите ID машины для удаления:',
        validate: input => input > 0 ? true : 'Введите корректный ID'
    }
]);

запрос ID для удаления

- const car = cars.find(c => c.id === id);
if (!car) {
    console.log('❌ Автомобиль не найден');
    return;
}

проверка существования автомобиля

- const { confirm } = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'confirm',
        message: `Вы уверены, что хотите удалить ${car.brand} ${car.model}?`,
        default: false
    }
]);

запрос подтверждения удаления

- if (confirm) {
    cars = cars.filter(c => c.id !== id);
    console.log('✅ Автомобиль успешно удален!');
} else {
    console.log('❌ Удаление отменено');
}

фильтрация массива для удаления автомобиля с указанным ID или отмена

- console.log('🚗 ПРОГРАММА УПРАВЛЕНИЯ КАТАЛОГОМ МАШИН');
showMenu();

запуск программы и отображение главного меню
