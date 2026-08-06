# BOLTOVKA ANARCHY

Статический сайт и форум для Minecraft-сервера BOLTOVKA ANARCHY.

## Публикация на Vercel

1. Загрузите все файлы этого репозитория в GitHub.
2. В Vercel нажмите **Add New → Project** и выберите репозиторий.
3. Оставьте Framework Preset как **Other** и нажмите **Deploy**.

Vercel автоматически будет обновлять сайт после каждого push в основную ветку.

## Личный кабинет и заявки

Для работы регистрации и отправки заявок подключите Postgres через Vercel Marketplace (например, Neon) и добавьте в **Project Settings → Environment Variables**:

- `DATABASE_URL` — строка подключения к Postgres;
- `BOLTOVKA_PLUGIN_KEY` — длинный случайный секрет (не публикуйте его).
- `DISCORD_WEBHOOK_URL` — webhook URL нужного канала Discord для заявок.

После добавления переменных сделайте новый Production Deploy. Таблицы будут созданы автоматически при первом запросе.

Чтобы создать Discord webhook: откройте нужный канал → **Изменить канал** → **Интеграции** → **Вебхуки** → **Создать вебхук** → **Копировать URL вебхука**. Сохраните этот URL только в переменной Vercel `DISCORD_WEBHOOK_URL`, не добавляйте его в GitHub.

## Плагин Minecraft

Исходник плагина находится в `minecraft-plugin/`. Соберите его командой `gradle build` на компьютере с Gradle и Java 8+; готовый файл будет в `minecraft-plugin/build/libs/`.

Поместите JAR в папку `plugins` вашего Paper/Spigot/Purpur-сервера (версии 1.16.5–1.21.1). После первого запуска в `plugins/BoltovkaAuth/config.yml` укажите URL Vercel-сайта и тот же `BOLTOVKA_PLUGIN_KEY`. Плагин каждые 10 секунд проверяет ожидающие регистрации и отправляет код только игроку с указанным ником через личное Minecraft-сообщение.
