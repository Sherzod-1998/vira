# Vira Audit Report

Sana: 2026-04-30

## Qisqa xulosa

Repo build bo'ldi va asosiy unit testlar o'tdi, lekin kod auditida bir nechta kritik xavfsizlik va runtime muammolar topildi. Past-risk va yuqori-aniqlikdagi xatolar patch qilindi, qolgan arxitektura darajasidagi muammolar esa keyingi navbat uchun qoldirildi.

## Patch qilingan muammolar

1. `memberAuthType` GraphQL input turi noto'g'ri enumga bog'langani tuzatildi.
   Fayl: `apps/vira-api/src/libs/dto/member/member.input.ts`

2. Oddiy user update flow'ida parol plain ko'rinishda saqlanib qolishi mumkin bo'lgan xato tuzatildi.
   Fayl: `apps/vira-api/src/components/member/member.service.ts`

3. Admin update flow'ida ham parol hashing qilinmayotgan xato tuzatildi.
   Fayl: `apps/vira-api/src/components/member/member.service.ts`

4. Signup va self-update orqali privilege escalation yo'li yopildi.
   O'zgarish: signup endi `memberType=USER` va `memberStatus=ACTIVE` ni server tomonda majburlaydi, self-update esa `memberType/memberStatus` ni qabul qilmaydi.
   Fayl: `apps/vira-api/src/components/member/member.service.ts`

5. `getProducts` `search` yuborilmasa runtime'da yiqilib ketishi mumkin edi, endi `null/undefined` xavfsiz ishlanadi.
   Fayl: `apps/vira-api/src/components/product/product.service.ts`

6. Public notices so'rovi endi faqat `ACTIVE` notice'larni qaytaradi.
   Fayl: `apps/vira-api/src/components/notice/notice.service.ts`

7. Notification service caller yuborgan `notificationTitle/notificationDesc` qiymatlarini ezib yubormasligi tuzatildi.
   Fayl: `apps/vira-api/src/components/notification/notification.service.ts`

8. Batch app API bilan bir xil fallback portga tushib qolmasligi uchun default port `3001` qilindi.
   Fayl: `apps/vira-batch/src/main.ts`

9. `npm run lint` ni yiqitayotgan unused import tozalandi.
   Fayl: `apps/vira-api/src/schemas/Notice.model.ts`

## Qo'shilgan testlar

1. `apps/vira-api/src/components/member/member.service.spec.ts`
   Password hashing va privilege field sanitization uchun testlar qo'shildi.

2. `apps/vira-api/src/components/product/product.service.spec.ts`
   `search` bo'lmaganda `getProducts` yiqilmasligini tekshiruvchi test qo'shildi.

3. `apps/vira-api/src/components/notification/notification.service.spec.ts`
   Custom notification title/description saqlanishini tekshiruvchi test qo'shildi.

## Hali ochiq qolgan muammolar

1. `Critical` JWT guardlar DB holatini tekshirmaydi.
   Natija: user bloklansa yoki roli pasaysa ham eski token bilan `30d` gacha yurishi mumkin.
   Tegishli fayllar:
   `apps/vira-api/src/components/auth/auth.service.ts`
   `apps/vira-api/src/components/auth/guards/auth.guard.ts`
   `apps/vira-api/src/components/auth/guards/roles.guard.ts`

2. `High` `.env` ichida repo bilan birga ketayotgan maxfiy ma'lumotlar bor.
   Tavsiya: zudlik bilan secret rotation qiling va `.env` ni source control'dan chiqarib tashlang.

3. `High` WebSocket auth token'ni URL query orqali oladi.
   Natija: log, proxy va history orqali token sizib chiqish xavfi yuqori.
   Fayl: `apps/vira-api/src/socket/socket.gateway.ts`

4. `High` Comment yaratishda target mavjudligi oldindan tekshirilmaydi.
   Natija: orphan comment va noto'g'ri counter paydo bo'lishi mumkin.
   Fayl: `apps/vira-api/src/components/comment/comment.service.ts`

5. `Medium` Admin comment delete counterlarni kamaytirmaydi.
   Fayl: `apps/vira-api/src/components/comment/comment.service.ts`

6. `Medium` `npm run test:e2e` siniq.
   Sabab: `apps/vira-api/test/jest-e2e.json` yo'q.

7. `Low` Mongo connection log'i constructor ichida erta ishlayotgani uchun noto'g'ri signal berishi mumkin.
   Fayllar:
   `apps/vira-api/src/database/database.module.ts`
   `apps/vira-batch/src/database/database.module.ts`

8. `Low` `README.md` hali default Nest shablon holatida.

## Tekshiruv natijalari

1. `npm run build`
   Natija: o'tdi

2. `npm test -- --runInBand --runTestsByPath apps/vira-api/src/components/member/member.service.spec.ts apps/vira-api/src/components/product/product.service.spec.ts apps/vira-api/src/components/notification/notification.service.spec.ts apps/vira-api/src/components/auth/auth.service.spec.ts`
   Natija: 4 suite, 13 test o'tdi

3. `npm run lint`
   Natija: o'tdi

4. `npm run test:e2e`
   Natija: yiqildi
   Xabar: `Can't find a root directory while resolving a config file path`

## Keyingi tavsiya

Keyingi eng to'g'ri ish JWT auth modelini DB-backed qilish, `.env` secretlarini aylantirish, va comment/notice flow'lari uchun service-level invariant testlar qo'shish bo'ladi.
