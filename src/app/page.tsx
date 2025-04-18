"use client";
import { Card } from "@/types/card.type";
import Image from "next/image";
import { useState, useEffect } from "react";
export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<number[]>([]);

  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCardIds.length === 2) {
      checkMatch();
    }
  }, [flippedCardIds]);

  const checkMatch = () => {
    setIsChecking(true);

    const firstCardId = flippedCardIds[0];
    const secondCardId = flippedCardIds[1];

    const firstCard = cards.find((card) => card.id === firstCardId);
    const secondCard = cards.find((card) => card.id === secondCardId);

    if (firstCard && secondCard && firstCard.imageUrl === secondCard.imageUrl) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          flippedCardIds.includes(card.id) ? { ...card, isMatched: true } : card
        )
      );
      setFlippedCardIds([]);
      setIsChecking(false);
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            flippedCardIds.includes(card.id) && !card.isMatched
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCardIds([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const initializeGame = () => {
    const imageUrls = [
      "/anor.jpg",
      "/apelsin.jpg",
      "/banan.jpg",
      "/limon.jpg",
      "/nok.jpg",
      "/olma.jpg",
      "/orik.jpg",
      "/shaftoli.jpg",
    ];

    let cardPairs: Card[] = [];
    imageUrls.forEach((imageUrl, index) => {
      cardPairs.push({
        id: index * 2,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      });

      cardPairs.push({
        id: index * 2 + 1,
        imageUrl,
        isFlipped: false,
        isMatched: false,
      });
    });

    cardPairs = shuffleArray(cardPairs);

    setCards(cardPairs);
    setFlippedCardIds([]);
  };

  const shuffleArray = (array: Card[]): Card[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (id: number) => {
    if (
      isChecking ||
      flippedCardIds.length >= 2 ||
      flippedCardIds.includes(id)
    ) {
      return;
    }

    const card = cards.find((card) => card.id === id);

    if (!card || card.isMatched || card.isFlipped) {
      return;
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCardIds((prev) => [...prev, id]);
  };

  const restartGame = () => {
    initializeGame();
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Memory Game</h1>
        <div className="flex justify-center gap-8 mb-4"></div>
        <button
          onClick={restartGame}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Qayta 
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`relative cursor-pointer w-20 h-20 sm:w-32 sm:h-32 perspective-500 ${
              card.isMatched ? "opacity-70" : ""
            }`}
          >
            <div
              className={`absolute w-full h-full transition-all duration-500 transform-style-preserve-3d ${
                card.isFlipped ? "rotate-y-180" : ""
              }`}
            >
              <div className="absolute w-full h-full bg-blue-500 rounded-lg flex items-center justify-center text-white backface-hidden border-2 border-blue-600 shadow-md">
                <span className="text-xl font-bold">?</span>
              </div>

              <div className="absolute w-full h-full bg-white rounded-lg flex items-center justify-center rotate-y-180 backface-hidden border-2 border-blue-300 shadow-md overflow-hidden">
                <Image
                  src={card.imageUrl}
                  alt={`Card ${card.id}`}
                  className="w-full h-full object-cover"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
