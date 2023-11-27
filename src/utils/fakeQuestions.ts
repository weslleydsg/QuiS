import { CreateRoomQuestionDTO } from '~/types/dto';

const artsMaths: CreateRoomQuestionDTO[] = [
  {
    description:
      'Qual é a fórmula matemática usada para calcular a área de um quadrado?',
    correctAlternative: 'b',
    alternatives: {
      a: 'Circunferência',
      b: 'Lado x Lado',
      c: 'Diâmetro x Pi',
      d: 'Comprimento x Largura',
    },
  },
  {
    description:
      'Na arte, qual é o nome dado a uma pintura que representa uma pessoa?',
    correctAlternative: 'c',
    alternatives: {
      a: 'Paisagem',
      b: 'Natureza Morta',
      c: 'Retrato',
      d: 'Abstrato',
    },
  },
  {
    description:
      'Qual é a operação matemática usada para descobrir o total de objetos quando se somam diferentes quantidades?',
    correctAlternative: 'd',
    alternatives: {
      a: 'Subtração',
      b: 'Multiplicação',
      c: 'Divisão',
      d: 'Adição',
    },
  },
];

const scienceArts: CreateRoomQuestionDTO[] = [
  {
    description:
      'Qual processo natural é responsável pela formação de arco-íris?',
    correctAlternative: 'b',
    alternatives: {
      a: 'Evaporação',
      b: 'Refração',
      c: 'Condensação',
      d: 'Precipitação',
    },
  },
  {
    description:
      'Quem foi um famoso pintor renascentista conhecido por suas obras como a Mona Lisa?',
    correctAlternative: 'c',
    alternatives: {
      a: 'Pablo Picasso',
      b: 'Vincent van Gogh',
      c: 'Leonardo da Vinci',
      d: 'Claude Monet',
    },
  },
  {
    description:
      'Qual dos seguintes materiais é um bom condutor de eletricidade?',
    correctAlternative: 'a',
    alternatives: {
      a: 'Cobre',
      b: 'Plástico',
      c: 'Madeira',
      d: 'Vidro',
    },
  },
];

const scienceMath: CreateRoomQuestionDTO[] = [
  {
    description: 'Qual é o resultado da multiplicação de 7 por 8?',
    correctAlternative: 'c',
    alternatives: {
      a: '48',
      b: '56',
      c: '64',
      d: '72',
    },
  },
  {
    description: 'O que é a circunferência de um círculo?',
    correctAlternative: 'b',
    alternatives: {
      a: 'A distância do centro até a borda',
      b: 'A medida ao redor do círculo',
      c: 'A metade do raio',
      d: 'A diagonal do círculo',
    },
  },
  {
    description: 'Qual é a principal função do coração no corpo humano?',
    correctAlternative: 'a',
    alternatives: {
      a: 'Bombeia o sangue para todo o corpo',
      b: 'Filtra o ar que respiramos',
      c: 'Produz insulina',
      d: 'Armazena nutrientes',
    },
  },
];

interface QuestionsBySubjects {
  [key: string]: CreateRoomQuestionDTO[] | undefined;
}

export const questionsBySubjects: QuestionsBySubjects = {
  'Ciências,Artes': scienceArts,
  'Ciências,Matemática': scienceMath,
  'Artes,Matemática': artsMaths,
};
