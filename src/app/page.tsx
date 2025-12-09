"use client";

import Card from "@/components/Basic/Card";
import CardIcon from "@/components/Basic/CardIcon";
import Button from "@/components/Basic/Button";
import PieChart from "@/components/ExpenseTrack/PieChart";
import AddNewExpense from "@/components/ExpenseTrack/AddNewExpense";

import { useState } from "react";

import { FiDollarSign } from "react-icons/fi";
import { SiLucide } from "react-icons/si";
import { AiOutlineFire } from "react-icons/ai";
import { GoTrophy } from "react-icons/go";

export default function Page() {
  const [timeline, setTimeline] = useState<"daily" | "weekly" | "monthly">("daily");

  const timelineButtons = [
    {
      text: "Diario",
      value: "daily",
      description: "este día",
    },
    {
      text: "Semanal",
      value: "weekly",
      description: "esta semana",
    },
    {
      text: "Mensual",
      value: "monthly",
      description: "este mes",
    },
  ];

  return (
    <main className="container py-8">
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl mb-1 font-bold">Bienvenido al panel de tubilletera</h1>
        <p className="text-md text-[var(--secondary-muted)]">
          Aquí podrás gestionar tus gastos y presupuestos.
        </p>
        <Card className="flex flex-row mt-3 p-1 bg-[var(--top-bar)] w-fit rounded-lg border-[1px] border-solid border-[var(--border)] text-[var(--secondary-muted)]">
          {timelineButtons.map((button) => (
            <button
              key={button.value}
              className={`cursor-pointer px-4 py-2 rounded-md ${timeline === button.value && "bg-[var(--primary)] text-[var(--bg)] font-medium"}`}
              onClick={() => setTimeline(button.value as typeof timeline)}
            >
              {button.text}
            </button>
          ))}
        </Card>
        <Card className="mt-3 p-5 grid grid-rows-2 grid-cols-2">
          <div className="mb-5">
            <div className="flex flex-row items-center gap-2">
              <CardIcon color="income" icon={<FiDollarSign size={20} />} />
              <p>Ingreso Mensual</p>
            </div>
            <p className="text-lg text-[var(--text)] font-medium mt-2">1000</p>
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <CardIcon color="available" icon={<SiLucide size={20} />} />
              <p>Objetivo de Presupuesto Diario</p>
            </div>
            <p className="text-lg text-[var(--text)] font-medium mt-2">50</p>
          </div>
          <div className="col-span-2 border-t-[1px] border-solid border-[var(--border)] pt-3 flex items-center">
            <Button className="px-4 py-2 text-lg" variant="secondary">
              Editar Ingreso Mensual & Presupuesto Diario
            </Button>
          </div>
        </Card>
        <div className="flex flex-row gap-5 mt-5">
          <Card className="grid grid-rows-2 grid-cols-2 w-full p-5">
            <CardIcon color="income" icon={<FiDollarSign size={20} />} />
            <div className="flex flex-row items-center justify-end">
              <p className="flex items-center justify-center rounded-lg bg-[var(--income-light)] text-[var(--income)] px-2 py-1 h-fit w-fit text-xs mb-3 font-medium">
                Ingresos
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg text-[var(--text)] font-medium">100</p>
              <p className="text-sm text-[var(--secondary-muted)]">
                {timelineButtons.find((button) => button.value === timeline)?.description}
              </p>
            </div>
          </Card>
          <Card className="grid grid-rows-2 grid-cols-2 w-full p-4">
            <CardIcon
              color="spent"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 17h6v-6"></path>
                  <path d="m22 17-8.5-8.5-5 5L2 7"></path>
                </svg>
              }
            />
            <div className="flex flex-row items-center justify-end">
              <p className="flex items-center justify-center rounded-lg bg-[var(--spent-light)] text-[var(--spent)] px-2 py-1 h-fit w-fit text-xs mb-3 font-medium">
                Gastos
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg text-[var(--text)] font-medium">0</p>
              <p className="text-sm text-[var(--secondary-muted)]">
                gastado en{" "}
                {timelineButtons.find((button) => button.value === timeline)?.description}
              </p>
            </div>
          </Card>
          <Card className="grid grid-rows-2 grid-cols-2 w-full p-4">
            <CardIcon
              color="available"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 7h6v6"></path>
                  <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
              }
            />
            <div className="flex flex-row items-center justify-end">
              <p className="flex items-center justify-center rounded-lg bg-[var(--available-light)] text-[var(--available)] px-2 py-1 h-fit w-fit text-xs mb-3 font-medium">
                Restante
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-lg text-[var(--text)] font-medium">100</p>
              <p className="text-sm text-[var(--secondary-muted)]">disponible para gastar</p>
            </div>
          </Card>
        </div>
        <Card className="grid grid-rows-3 grid-cols-3 mt-5 p-4 gap-4">
          <div className="col-span-3 flex flex-row items-center">
            <CardIcon color="streak" icon={<AiOutlineFire size={20} />} />
            <div className="ml-2">
              <p className="text-lg text-[var(--text)] font-medium">Racha de ahorro</p>
              <p className="text-sm text-[var(--secondary-muted)]">
                Días consecutivos ahorrando dinero
              </p>
            </div>
          </div>
          <div className="border-[1px] border-solid border-[var(--streak)]/20 rounded-lg bg-[var(--streak-light)]/40 p-2">
            <div className="flex flex-row items-center gap-2 mb-2">
              <AiOutlineFire className="text-[var(--streak)]" size={20} />
              <p className="text-[var(--muted-foreground)]">Racha actual de ahorro</p>
            </div>
            <p>21 días</p>
          </div>
          <div className="border-[1px] border-solid border-[var(--best)]/20 rounded-lg bg-[var(--best-light)]/40 p-2">
            <div className="flex flex-row items-center gap-2 mb-2">
              <GoTrophy className="text-[var(--best)]" size={20} />
              <p className="text-[var(--muted-foreground)]">Mejor racha</p>
            </div>
            <p>40 días</p>
          </div>
          <div className="border-[1px] border-solid border-[var(--available)]/20 rounded-lg bg-[var(--available-light)]/40 p-2">
            <div className="flex flex-row items-center gap-2 mb-2">
              <svg
                className="text-[var(--available)]"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 7h6v6"></path>
                <path d="m22 7-8.5 8.5-5-5L2 17"></path>
              </svg>
              <p className="text-[var(--muted-foreground)]">Días registrados</p>
            </div>
            <p>125 días</p>
          </div>
          <div className="col-span-3 flex items-center justify-center border-[1px] border-solid border-[var(--streak)]/20 rounded-lg bg-[var(--streak-light)]/40 h-fit py-3">
            <p>
              🎉 ¡Increíble! ¡Has estado ahorrando durante{" "}
              <span className="font-bold">21 días</span> seguidos!
            </p>
          </div>
        </Card>
        <div className="flex flex-row gap-5 mt-5">
          <Card className="w-full p-4">Aún no hay gastos para mostrar.</Card>
          <Card className="w-full p-4">Aún no hay gastos para mostrar.</Card>
        </div>
        <Card className="mt-5 p-4">Historial de gastos</Card>
      </div>
      <AddNewExpense className="fixed bottom-5 right-5" />
      {/* <PieChart /> */}
    </main>
  );
}
