import { useState } from "react";
import { useSeo } from "../hooks/useSeo";

const FAQS = [
  {
    question: "주문한 상품은 실제로 배송되나요?",
    answer:
      "아닙니다. 이 사이트는 포트폴리오/학습 목적의 데모로, 실제 결제와 배송이 이루어지지 않습니다. 주문 접수는 Mock 플로우로 처리됩니다.",
  },
  {
    question: "회원가입이 필요한가요?",
    answer:
      "회원가입과 로그인 기능은 제공하지 않습니다. 장바구니와 위시리스트는 브라우저의 localStorage에 저장되며, 다른 기기나 브라우저에서는 공유되지 않습니다.",
  },
  {
    question: "장바구니/위시리스트 데이터는 어디에 저장되나요?",
    answer:
      "별도의 서버나 계정 없이 현재 사용 중인 브라우저에만 저장됩니다. 브라우저 저장소를 비우거나 다른 기기로 접속하면 데이터가 유지되지 않습니다.",
  },
  {
    question: "상품 가격과 재고 정보는 실제 시세를 반영하나요?",
    answer:
      "아닙니다. 상품 데이터는 GPU 시리즈 스펙을 바탕으로 결정적으로(deterministic) 생성된 가상의 데모 데이터이며, 실제 시세나 재고와 무관합니다.",
  },
  {
    question: "결제는 어떻게 진행되나요?",
    answer:
      "실제 PG(결제대행사) 연동 없이 주문서를 작성하면 Mock 주문번호가 발급되는 접수 플로우로 끝납니다. 주문 완료 페이지는 새로고침 시 정보가 사라질 수 있습니다.",
  },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useSeo({
    title: "자주 묻는 질문",
    description: "그래픽카드 전문몰 이용 전 알아두면 좋은 자주 묻는 질문과 답변을 확인하세요.",
    path: "/faq",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">자주 묻는 질문</h1>
      <p className="mt-2 text-sm text-slate-500">이용 전 참고하시면 좋은 안내입니다.</p>

      <div className="mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <p className="pb-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
