export const WA_PHONE = "5511947069990";
export const INSTAGRAM = "https://www.instagram.com/yalorixa.marlene/";
export function whatsapp(message: string) {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
export const messages = {
  general:
    "Olá, Iyá Marlene! Conheci seu trabalho pelo site e gostaria de saber mais sobre os atendimentos.",
  booking:
    "Olá, Iyá Marlene! Gostaria de saber como posso agendar uma consulta.",
  products:
    "Olá, Iyá Marlene! Gostaria de saber mais sobre os banhos, sabonetes e perfumes.",
};
export const services = [
  {
    index: "01",
    image: "/images/v2/cartas.webp",
    imageAlt: "Imagem conceitual de cartas sobre uma mesa",
    imagePosition: "55% 66%",
    imageScale: 1.25,
    message: "Olá, Iyá Marlene! Gostaria de saber mais sobre o jogo de cartas.",
    title: "Jogo de cartas",
    description:
      "Um momento de escuta e orientação por meio da leitura das cartas, para quem busca refletir sobre questões e caminhos.",
  },
  {
    index: "02",
    image: "/images/v2/buzios.webp",
    imageAlt: "Imagem conceitual de búzios em uma tigela de madeira",
    imagePosition: "69% 61%",
    imageScale: 1.7,
    message: "Olá, Iyá Marlene! Gostaria de saber mais sobre o jogo de búzios.",
    title: "Jogo de búzios",
    description:
      "Consulta oracular conduzida com respeito à tradição e aos fundamentos espirituais.",
  },
  {
    index: "03",
    image: "/images/v2/trabalhos-espirituais.webp",
    imageAlt:
      "Imagem conceitual de velas e flores, sem registro de trabalho real",
    imagePosition: "38% 40%",
    imageScale: 1.45,
    message:
      "Olá, Iyá Marlene! Gostaria de saber mais sobre os trabalhos espirituais.",
    title: "Trabalhos espirituais",
    description:
      "Conheça os trabalhos realizados por Iyá Marlene e converse diretamente para entender as possibilidades de atendimento.",
  },
];
export const navigation = [
  { label: "Atendimentos", href: "#atendimentos" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre", href: "#sobre" },
] as const;

export const DEVELOPER_URL = "https://smartlocal.com.br";

export const biography = {
  title: "Uma trajetória de fé, aprendizado e dedicação espiritual",
  paragraphs: [
    "A caminhada espiritual de Iyá Marlene começou na Umbanda, mesmo diante das dúvidas que acompanhavam sua criação evangélica. Aos 15 anos, viveu uma experiência marcante com Seu Tranca Ruas, dando início a uma jornada de descobertas e aprofundamento espiritual.",
    "Com o passar do tempo, seguiu seu caminho e foi iniciada no Candomblé, até chegar ao sacerdócio como Yalorixá.",
    "Hoje, sua trajetória reúne a força da Jurema e a sabedoria de Ifá, conduzida pela fé, pelo respeito às tradições e pelo compromisso com a orientação espiritual.",
  ],
  portrait: "/images/iya-marlene.jpg",
} as const;

export const availability = [
  {
    id: "online",
    title: "Atendimento online",
    days: "Segunda a sexta-feira",
    hours: "Das 20h às 22h",
    cta: "Agendar atendimento online",
    message:
      "Olá, Iyá Marlene! Gostaria de saber sobre a disponibilidade para um atendimento online.",
  },
  {
    id: "presencial",
    title: "Atendimento presencial",
    days: "Sábados",
    hours: "Das 10h às 13h",
    cta: "Agendar atendimento presencial",
    message:
      "Olá, Iyá Marlene! Gostaria de saber sobre a disponibilidade para um atendimento presencial.",
  },
] as const;
