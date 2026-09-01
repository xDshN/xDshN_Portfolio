# Портфолио Андрея Варнавского

Полный исходный проект сайта, подготовленный для автоматической публикации на GitHub Pages.

В репозитории находятся:

- весь код сайта;
- десктопная и мобильная версии;
- фотографии, графика и четыре видео;
- favicon и метаданные страницы;
- автоматический сценарий публикации `.github/workflows/deploy-pages.yml`.

## Публикация на GitHub Pages

1. Откройте `Settings` → `Pages`.
2. В блоке `Build and deployment` выберите `Source: GitHub Actions`.
3. После слияния изменений в `main` workflow `Deploy portfolio to GitHub Pages` запустится автоматически.

Через несколько минут сайт будет доступен по адресу:

```text
https://xDshN.github.io/xDshN_Portfolio/
```

Путь к репозиторию определяется автоматически: изображения, видео, favicon и файлы Next.js работают внутри подпути GitHub Pages.

## Локальный запуск

Потребуется Node.js 22 или новее.

```bash
npm ci
npm run dev
```

Откройте `http://localhost:3000`.

Для проверки финальной статической сборки:

```bash
npm test
npx serve out
```

## Как обновлять сайт

Редактируйте файлы в `app/` и ассеты в `public/assets/`. После каждого `push` в ветку `main` GitHub Actions пересоберёт сайт и заменит опубликованную версию.

Основные файлы:

- `app/page.tsx` — тексты, карточки, проекты, интерактивность;
- `app/globals.css` — визуальная стилистика и адаптив;
- `app/layout.tsx` — заголовок, описание и favicon;
- `public/assets/` — фотографии, видео и иконки;
- `next.config.ts` — статический экспорт и поддержка подпути GitHub Pages;
- `.github/workflows/deploy-pages.yml` — автоматическая публикация.

## Важно

- Не добавляйте `node_modules` и `.next` в Git.
- Не удаляйте `.nojekyll`, `.github/workflows/deploy-pages.yml` и `next.config.ts`.
- Все медиа входят в проект; отдельный CDN или сервер не требуется.
- Сайт полностью статический: база данных и серверные функции для GitHub Pages не нужны.
