-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "month" SMALLINT NOT NULL,
    "day" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);