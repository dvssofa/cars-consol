import inquirer from 'inquirer';

type CarCondition = 'New' | 'Used';

interface Car {
    id: number;
    manufacturer: string;
    model: string;
    year: number;
    condition: CarCondition;
    price: number;
}

class CarCatalog {
    private cars: Car[] = [];
    private nextId: number = 1;

    addCar(data: Omit<Car, 'id'>) {
        this.cars.push({ ...data, id: this.nextId++ });
    }

    getAll() { return this.cars; }

    getById(id: number) { return this.cars.find(c => c.id === id); }

    update(id: number, data: Partial<Omit<Car, 'id'>>) {
        const idx = this.cars.findIndex(c => c.id === id);
        if (idx === -1) return false;
        this.cars[idx] = { ...this.cars[idx], ...data };
        return true;
    }

    delete(id: number) {
        const len = this.cars.length;
        this.cars = this.cars.filter(c => c.id !== id);
        return this.cars.length < len;
    }
}

const catalog = new CarCatalog();

async function pause() {
    await inquirer.prompt({ type: 'input', name: 'k', message: 'Нажмите Enter...' });
}

async function main() {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Меню:',
                choices: [
                    { name: 'Список машин', value: 'list' },
                    { name: 'Добавить', value: 'create' },
                    { name: 'Редактировать', value: 'update' },
                    { name: 'Удалить', value: 'delete' },
                    { name: 'Выход', value: 'exit' }
                ]
            }
        ]);

        if (action === 'exit') break;

        if (action === 'list') {
            const cars = catalog.getAll();
            if (!cars.length) {
                console.log('Список пуст.');
            } else {
                cars.forEach(c =>
                    console.log(`[${c.id}] ${c.manufacturer} ${c.model} (${c.year}) - $${c.price} (${c.condition})`)
                );
            }
            await pause();
        }

        if (action === 'create') {
            const raw = await inquirer.prompt([
                { type: 'input', name: 'manufacturer', message: 'Производитель:', validate: (v: string) => !!v },
                { type: 'input', name: 'model', message: 'Модель:', validate: (v: string) => !!v },
                { 
                    type: 'input', 
                    name: 'year', 
                    message: 'Год:', 
                    validate: (v: string) => parseInt(v) > 1900 ? true : 'Некорректный год' 
                },
                { type: 'list', name: 'condition', message: 'Состояние:', choices: ['New', 'Used'] },
                { 
                    type: 'input', 
                    name: 'price', 
                    message: 'Цена:', 
                    validate: (v: string) => parseFloat(v) > 0 ? true : 'Цена должна быть > 0' 
                }
            ]);

            catalog.addCar({
                manufacturer: raw.manufacturer,
                model: raw.model,
                year: parseInt(raw.year),
                condition: raw.condition as CarCondition,
                price: parseFloat(raw.price)
            });
            
            console.log('Добавлено.');
            await pause();
        }

        if (action === 'update') {
            const cars = catalog.getAll();
            if (!cars.length) {
                console.log('Нет данных.');
                await pause();
                continue;
            }

            const { id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Выберите ID:',
                    choices: cars.map(c => ({ name: "${c.id}: ${c.model}", value: c.id }))
                }
            ]);

            const car = catalog.getById(id);
            if (!car) continue;

            const raw = await inquirer.prompt([
                {type: 'input', name: 'model', message: 'Модель:', default: car.model },
                {type: 'input', 
                    name: 'price', 
                    message: 'Цена:', 
                    default: car.price.toString(),
                    validate: (v: string) => parseFloat(v) > 0 ? true : 'Цена должна быть > 0'
                }
            ]);

            catalog.update(id, {
                model: raw.model,
                price: parseFloat(raw.price)
            });
            
            console.log('Обновлено.');
            await pause();
        }

        if (action === 'delete') {
            const cars = catalog.getAll();
            if (!cars.length) {
                console.log('Нет данных.');
                await pause();
                continue;
            }

            const { id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Выберите ID для удаления:',
                    choices: cars.map(c => ({ name: "${c.id}: ${c.model}", value: c.id }))
                }
            ]);

            const { confirm } = await inquirer.prompt([
                { type: 'confirm', name: 'confirm', message: 'Подтвердить удаление?', default: false }
            ]);

            if (confirm) {
                catalog.delete(id);
                console.log('Удалено.');
            }
            await pause();
        }
    }
}

main();
