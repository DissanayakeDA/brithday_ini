-- CreateTable
CREATE TABLE "event_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "venue" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "dateTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_settings_pkey" PRIMARY KEY ("id")
);
