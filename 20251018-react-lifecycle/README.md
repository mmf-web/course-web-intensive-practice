# Жизненный цикл в React

## Запуск

Необходимо запустить 2 проекта:

- `react` - `cd react && npm run dev`
- `server` - `cd server && npx json-server db.json`

> Если сервер не запускается, то можно установить JSON Server глобально: `npm install -g json-server` или проделать то же самое, что мы делали в классе в `5-fetch`

## Пройденный материал

- Жизненный цикл в классовых компонентах (старый подход), жизненный цикл в функциональных компонентах (новый подход)
  - `constructor`
  - `componentWillMount`
  - `componentDidMount`
  - `componentDidUpdate`
  - `componentWillUnmount`
  - `render`
- Хук `useEffect`: массив зависимостей и его связь с методами жизненного цикла
- `key` для списков
- Дописали TODO List до логического завершения
