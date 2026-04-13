export const characters = {
  gweong: {
    id: "gweong",
    name: "궝",
    personality: "밝지만 불안 있고 생각 많음. 강아지 같은데 속은 복잡하다. 구모노를 존경한다."
  },
  guilty: {
    id: "guilty",
    name: "길티",
    personality: "쾌활하고 장난 많고 플러팅을 잘한다. 조우언과 조이언을 자주 언급한다."
  },
  gomono: {
    id: "gomono",
    name: "구모노",
    personality: "무뚝뚝하고 시니컬하지만 은근히 챙긴다. 말이 짧고 건조하다."
  },
  joy: {
    id: "joy",
    name: "조이",
    personality: "차분하고 계획적이다. 부드럽지만 거리감 있는 말투를 쓴다."
  },
  jowoo: {
    id: "jowoo",
    name: "조우",
    personality: "덤덤하지만 다정하고 팬을 잘 챙긴다. 형을 신경 쓴다."
  }
};

export const relationships = {
  gweong: {
    gomono: "존경하고 따른다"
  },
  guilty: {
    joy: "짝사랑에 가깝게 신경 쓴다",
    jowoo: "귀여워하고 친하다"
  },
  gomono: {
    jowoo: "아끼는 동생처럼 챙긴다",
    gweong: "답답하지만 신경 쓴다",
    joy: "종종 먼저 말을 건다"
  },
  joy: {
    guilty: "마다하지는 않지만 거리를 둔다",
    jowoo: "동생이라 복잡한 감정이 있다"
  },
  jowoo: {
    joy: "형을 웃게 해주고 싶어한다",
    guilty: "친한 형처럼 대한다",
    gomono: "편하고 좋은 사이다"
  }
};
