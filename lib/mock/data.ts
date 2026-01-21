import type { NewsItem } from "@/types/news";
import type { Law, LawArticle } from "@/types/laws";

// 法令モックデータ
export const mockLaws: Law[] = [
  {
    id: "mock-law-1",
    name: "個人情報の保護に関する法律",
    eGovLawId: "420AC0000000057",
    lawNum: "平成十五年法律第五十七号",
    promulgationDate: "2003-05-30",
    officialUrl: "https://elaws.e-gov.go.jp/document?lawid=415AC0000000057",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-law-2",
    name: "労働基準法",
    eGovLawId: "322AC0000000049",
    lawNum: "昭和二十二年法律第四十九号",
    promulgationDate: "1947-04-07",
    officialUrl: "https://elaws.e-gov.go.jp/document?lawid=322AC0000000049",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-law-3",
    name: "道路交通法",
    eGovLawId: "335AC0000000105",
    lawNum: "昭和三十五年法律第百五号",
    promulgationDate: "1960-06-25",
    officialUrl: "https://elaws.e-gov.go.jp/document?lawid=335AC0000000105",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-law-4",
    name: "民法",
    eGovLawId: "129AC0000000089",
    lawNum: "明治二十九年法律第八十九号",
    promulgationDate: "1896-04-27",
    officialUrl: "https://elaws.e-gov.go.jp/document?lawid=129AC0000000089",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];

// 条文モックデータ
export const mockLawArticles: LawArticle[] = [
  // 個人情報保護法
  {
    id: "mock-article-1-1",
    lawId: "mock-law-1",
    articleNum: "第一条",
    articleText:
      "この法律は、デジタル社会の進展に伴い個人情報の利用が著しく拡大していることに鑑み、個人情報の適正な取扱いに関し、基本理念及び政府による基本方針の作成その他の個人情報の保護に関する施策の基本となる事項を定め、国及び地方公共団体の責務等を明らかにし、個人情報を取り扱う事業者及び行政機関等についてこれらの特性に応じて遵守すべき義務等を定めるとともに、個人情報保護委員会を設置することにより、行政機関等の事務及び事業の適正かつ円滑な運営を図り、並びに個人情報の適正かつ効果的な活用が新たな産業の創出並びに活力ある経済社会及び豊かな国民生活の実現に資するものであることその他の個人情報の有用性に配慮しつつ、個人の権利利益を保護することを目的とする。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-article-1-2",
    lawId: "mock-law-1",
    articleNum: "第十七条",
    articleText:
      "個人情報取扱事業者は、偽りその他不正の手段により個人情報を取得してはならない。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  // 労働基準法
  {
    id: "mock-article-2-1",
    lawId: "mock-law-2",
    articleNum: "第三十二条",
    articleText:
      "使用者は、労働者に、休憩時間を除き一週間について四十時間を超えて、労働させてはならない。\n２　使用者は、一週間の各日については、労働者に、休憩時間を除き一日について八時間を超えて、労働させてはならない。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-article-2-2",
    lawId: "mock-law-2",
    articleNum: "第三十七条",
    articleText:
      "使用者が、第三十三条又は前条第一項の規定により労働時間を延長し、又は休日に労働させた場合においては、その時間又はその日の労働については、通常の労働時間又は労働日の賃金の計算額の二割五分以上五割以下の範囲内でそれぞれ政令で定める率以上の率で計算した割増賃金を支払わなければならない。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  // 道路交通法
  {
    id: "mock-article-3-1",
    lawId: "mock-law-3",
    articleNum: "第七十一条の四の二",
    articleText:
      "自動車又は原動機付自転車（以下この条において「自動車等」という。）の運転者は、当該自動車等の走行中に、携帯電話用装置、自動車電話用装置その他の無線通話装置（その全部又は一部を手で保持しなければ送信及び受信のいずれをも行うことができないものに限る。）を通話（傷病者の救護又は公共の安全の維持のため当該自動車等の走行中に緊急やむを得ずに行うものを除く。）のために使用し、又は当該自動車等に取り付けられ若しくは持ち込まれた画像表示用装置（道路運送車両法第四十一条第一項第十六号若しくは第十七号又は第四十四条第十一号に規定する装置であるものを除く。）に表示された画像を注視してはならない。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  // 民法
  {
    id: "mock-article-4-1",
    lawId: "mock-law-4",
    articleNum: "第七百九条",
    articleText:
      "故意又は過失によって他人の権利又は法律上保護される利益を侵害した者は、これによって生じた損害を賠償する責任を負う。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "mock-article-4-2",
    lawId: "mock-law-4",
    articleNum: "第九十条",
    articleText:
      "公の秩序又は善良の風俗に反する法律行為は、無効とする。",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];

// ニュースモックデータ（15件）
export const mockNewsItems: NewsItem[] = [
  {
    id: "mock-news-1",
    articleId: "mock-article-id-1",
    title: "【モック】大手企業で個人情報流出 約100万件の顧客データが外部に",
    description:
      "大手企業のサーバーがサイバー攻撃を受け、約100万件の顧客個人情報が流出した可能性があることが判明しました。",
    link: "https://example.com/news/1",
    ogImage: "https://picsum.photos/seed/mock-news-1/800/450",
    aiEstimatedLaws: ["個人情報の保護に関する法律"],
    lawRelevanceNotes: [
      {
        lawName: "個人情報の保護に関する法律",
        relevanceNote:
          "個人情報取扱事業者には適切な安全管理措置を講じる義務があり、漏えい等が発生した場合の報告義務も課されています。",
      },
    ],
    lawColumnTitle: "個人情報保護法と企業の責任",
    lawColumn:
      "個人情報保護法では、事業者に対して個人データの安全管理のために必要かつ適切な措置を講じることを義務付けています。今回のような大規模な情報流出は、この義務違反に該当する可能性があります。",
    relatedArticles: [
      {
        lawId: "mock-law-1",
        articleId: "mock-article-1-1",
        relevanceNote: "法律の目的と個人の権利利益保護について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-20T10:00:00Z"),
    createdAt: new Date("2025-01-20T10:00:00Z"),
    updatedAt: new Date("2025-01-20T10:00:00Z"),
  },
  {
    id: "mock-news-2",
    articleId: "mock-article-id-2",
    title: "【モック】残業規制強化へ 政府が労働時間上限の見直し検討",
    description:
      "政府は働き方改革の一環として、残業時間の上限規制をさらに強化する方針を固めました。",
    link: "https://example.com/news/2",
    ogImage: "https://picsum.photos/seed/mock-news-2/800/450",
    aiEstimatedLaws: ["労働基準法"],
    lawRelevanceNotes: [
      {
        lawName: "労働基準法",
        relevanceNote:
          "労働基準法では労働時間の上限が定められており、残業には割増賃金の支払いが必要です。",
      },
    ],
    lawColumnTitle: "労働基準法と残業規制",
    lawColumn:
      "労働基準法第32条では、1日8時間・週40時間を法定労働時間と定めています。これを超える労働（残業）には、36協定の締結と届出が必要です。",
    relatedArticles: [
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-1",
        relevanceNote: "労働時間の上限規定について",
      },
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-2",
        relevanceNote: "残業に対する割増賃金について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-19T14:30:00Z"),
    createdAt: new Date("2025-01-19T14:30:00Z"),
    updatedAt: new Date("2025-01-19T14:30:00Z"),
  },
  {
    id: "mock-news-3",
    articleId: "mock-article-id-3",
    title: "【モック】ながらスマホ運転の厳罰化 反則金引き上げへ",
    description:
      "運転中のスマートフォン使用による事故が増加していることを受け、警察庁は反則金の引き上げを検討しています。",
    link: "https://example.com/news/3",
    ogImage: "https://picsum.photos/seed/mock-news-3/800/450",
    aiEstimatedLaws: ["道路交通法"],
    lawRelevanceNotes: [
      {
        lawName: "道路交通法",
        relevanceNote:
          "道路交通法では運転中の携帯電話使用や画面注視を禁止しており、違反には反則金や懲役刑が科されます。",
      },
    ],
    lawColumnTitle: "道路交通法とながらスマホ規制",
    lawColumn:
      "道路交通法第71条の4の2では、自動車等の走行中に携帯電話等を通話のために使用したり、画面を注視することを禁止しています。",
    relatedArticles: [
      {
        lawId: "mock-law-3",
        articleId: "mock-article-3-1",
        relevanceNote: "携帯電話使用等の禁止規定について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-18T09:15:00Z"),
    createdAt: new Date("2025-01-18T09:15:00Z"),
    updatedAt: new Date("2025-01-18T09:15:00Z"),
  },
  {
    id: "mock-news-4",
    articleId: "mock-article-id-4",
    title: "【モック】SNS誹謗中傷で損害賠償命令 被害者に300万円",
    description:
      "SNS上で名誉毀損の投稿を繰り返した被告に対し、裁判所は300万円の損害賠償を命じました。",
    link: "https://example.com/news/4",
    ogImage: "https://picsum.photos/seed/mock-news-4/800/450",
    aiEstimatedLaws: ["民法"],
    lawRelevanceNotes: [
      {
        lawName: "民法",
        relevanceNote:
          "民法第709条の不法行為に基づき、他人の権利を侵害した場合は損害賠償責任を負います。",
      },
    ],
    lawColumnTitle: "民法と不法行為責任",
    lawColumn:
      "民法第709条では、故意または過失によって他人の権利を侵害した者は、損害賠償責任を負うと定められています。SNSでの誹謗中傷も名誉権の侵害として不法行為に該当します。",
    relatedArticles: [
      {
        lawId: "mock-law-4",
        articleId: "mock-article-4-1",
        relevanceNote: "不法行為による損害賠償責任について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-17T16:45:00Z"),
    createdAt: new Date("2025-01-17T16:45:00Z"),
    updatedAt: new Date("2025-01-17T16:45:00Z"),
  },
  {
    id: "mock-news-5",
    articleId: "mock-article-id-5",
    title: "【モック】AI採用システムに個人情報保護の課題",
    description:
      "企業の採用活動でAIによる選考が広がる中、応募者の個人情報の取り扱いについて専門家が警鐘を鳴らしています。",
    link: "https://example.com/news/5",
    ogImage: "https://picsum.photos/seed/mock-news-5/800/450",
    aiEstimatedLaws: ["個人情報の保護に関する法律"],
    lawRelevanceNotes: [
      {
        lawName: "個人情報の保護に関する法律",
        relevanceNote:
          "AI採用においても個人情報の適正な取得・利用が求められ、利用目的の通知や本人同意が必要です。",
      },
    ],
    lawColumnTitle: "AI活用と個人情報保護",
    lawColumn:
      "個人情報保護法では、個人情報を取得する際に利用目的を明示し、その目的の範囲内で利用することが義務付けられています。AIによるプロファイリングも同様のルールが適用されます。",
    relatedArticles: [
      {
        lawId: "mock-law-1",
        articleId: "mock-article-1-2",
        relevanceNote: "個人情報の適正な取得について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-16T11:20:00Z"),
    createdAt: new Date("2025-01-16T11:20:00Z"),
    updatedAt: new Date("2025-01-16T11:20:00Z"),
  },
  {
    id: "mock-news-6",
    articleId: "mock-article-id-6",
    title: "【モック】週休3日制導入企業が増加 労働時間の柔軟化進む",
    description:
      "働き方改革の一環として、週休3日制を導入する企業が増えています。労働時間の柔軟な運用が広がっています。",
    link: "https://example.com/news/6",
    ogImage: "https://picsum.photos/seed/mock-news-6/800/450",
    aiEstimatedLaws: ["労働基準法"],
    lawRelevanceNotes: [
      {
        lawName: "労働基準法",
        relevanceNote:
          "労働基準法では週40時間の労働時間規制がありますが、変形労働時間制により柔軟な運用が可能です。",
      },
    ],
    lawColumnTitle: "労働基準法と変形労働時間制",
    lawColumn:
      "週休3日制を導入する場合、1日の労働時間を延長して週40時間を維持する方法と、総労働時間を減らす方法があります。いずれの場合も労働基準法の規定を遵守する必要があります。",
    relatedArticles: [
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-1",
        relevanceNote: "法定労働時間の規定について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-15T08:00:00Z"),
    createdAt: new Date("2025-01-15T08:00:00Z"),
    updatedAt: new Date("2025-01-15T08:00:00Z"),
  },
  {
    id: "mock-news-7",
    articleId: "mock-article-id-7",
    title: "【モック】自動運転車の事故責任は誰に？法整備の議論加速",
    description:
      "自動運転車の普及に向け、事故発生時の責任の所在について法整備の議論が活発化しています。",
    link: "https://example.com/news/7",
    ogImage: "https://picsum.photos/seed/mock-news-7/800/450",
    aiEstimatedLaws: ["道路交通法", "民法"],
    lawRelevanceNotes: [
      {
        lawName: "道路交通法",
        relevanceNote: "自動運転レベルに応じた運転者の義務と責任が規定されています。",
      },
      {
        lawName: "民法",
        relevanceNote: "事故時の損害賠償責任について、製造者責任との関係が議論されています。",
      },
    ],
    lawColumnTitle: "自動運転と法的責任",
    lawColumn:
      "自動運転車の事故責任は、運転者・自動車メーカー・システム開発者など複数の主体が関係し得るため、既存の法制度だけでは対応しきれない課題があります。",
    relatedArticles: [
      {
        lawId: "mock-law-4",
        articleId: "mock-article-4-1",
        relevanceNote: "不法行為責任の基本原則について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-14T13:30:00Z"),
    createdAt: new Date("2025-01-14T13:30:00Z"),
    updatedAt: new Date("2025-01-14T13:30:00Z"),
  },
  {
    id: "mock-news-8",
    articleId: "mock-article-id-8",
    title: "【モック】フリマアプリで偽ブランド品販売 詐欺容疑で逮捕",
    description:
      "フリマアプリで偽ブランド品を販売していた男が詐欺容疑で逮捕されました。被害総額は約500万円に上るとみられています。",
    link: "https://example.com/news/8",
    ogImage: "https://picsum.photos/seed/mock-news-8/800/450",
    aiEstimatedLaws: ["民法"],
    lawRelevanceNotes: [
      {
        lawName: "民法",
        relevanceNote:
          "詐欺による意思表示は取り消すことができ、損害賠償請求の対象となります。",
      },
    ],
    lawColumnTitle: "詐欺と民法上の救済",
    lawColumn:
      "民法第96条では詐欺による意思表示は取り消すことができると規定されています。また、詐欺行為は民法第709条の不法行為にも該当し、損害賠償を請求できます。",
    relatedArticles: [
      {
        lawId: "mock-law-4",
        articleId: "mock-article-4-1",
        relevanceNote: "不法行為による損害賠償について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-13T15:45:00Z"),
    createdAt: new Date("2025-01-13T15:45:00Z"),
    updatedAt: new Date("2025-01-13T15:45:00Z"),
  },
  {
    id: "mock-news-9",
    articleId: "mock-article-id-9",
    title: "【モック】テレワーク中の労災認定基準を明確化 厚労省が指針",
    description:
      "テレワーク中の事故やケガについて、労災認定の判断基準を明確化する指針を厚生労働省がまとめました。",
    link: "https://example.com/news/9",
    ogImage: "https://picsum.photos/seed/mock-news-9/800/450",
    aiEstimatedLaws: ["労働基準法"],
    lawRelevanceNotes: [
      {
        lawName: "労働基準法",
        relevanceNote:
          "使用者には労働者の安全と健康を確保する義務があり、テレワーク時も同様です。",
      },
    ],
    lawColumnTitle: "テレワークと労働法規",
    lawColumn:
      "テレワーク中でも労働基準法は適用されます。業務遂行中の事故は労災の対象となりますが、私的行為中の事故との区別が難しいケースもあります。",
    relatedArticles: [
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-1",
        relevanceNote: "労働時間の管理と安全配慮義務について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-12T10:10:00Z"),
    createdAt: new Date("2025-01-12T10:10:00Z"),
    updatedAt: new Date("2025-01-12T10:10:00Z"),
  },
  {
    id: "mock-news-10",
    articleId: "mock-article-id-10",
    title: "【モック】Cookie規制強化 ウェブサイトの同意取得義務化へ",
    description:
      "ウェブサイトのCookie利用について、ユーザーからの明示的な同意取得を義務化する法改正が検討されています。",
    link: "https://example.com/news/10",
    ogImage: "https://picsum.photos/seed/mock-news-10/800/450",
    aiEstimatedLaws: ["個人情報の保護に関する法律"],
    lawRelevanceNotes: [
      {
        lawName: "個人情報の保護に関する法律",
        relevanceNote:
          "Cookieで収集されるデータが個人情報に該当する場合、個人情報保護法の規制対象となります。",
      },
    ],
    lawColumnTitle: "Cookieと個人情報保護",
    lawColumn:
      "Cookie自体は個人情報ではありませんが、他の情報と組み合わせて個人を特定できる場合は個人情報として扱われます。EUのGDPRに続き、日本でも規制強化の動きがあります。",
    relatedArticles: [
      {
        lawId: "mock-law-1",
        articleId: "mock-article-1-1",
        relevanceNote: "個人情報保護法の目的と適用範囲について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-11T17:20:00Z"),
    createdAt: new Date("2025-01-11T17:20:00Z"),
    updatedAt: new Date("2025-01-11T17:20:00Z"),
  },
  {
    id: "mock-news-11",
    articleId: "mock-article-id-11",
    title: "【モック】電動キックボード事故増加 安全教育の強化求める声",
    description:
      "電動キックボードによる事故が増加しており、安全教育の強化や規制の見直しを求める声が高まっています。",
    link: "https://example.com/news/11",
    ogImage: "https://picsum.photos/seed/mock-news-11/800/450",
    aiEstimatedLaws: ["道路交通法"],
    lawRelevanceNotes: [
      {
        lawName: "道路交通法",
        relevanceNote:
          "特定小型原動機付自転車として道路交通法の規制対象となり、交通ルールの遵守が義務付けられています。",
      },
    ],
    lawColumnTitle: "電動キックボードの法的位置づけ",
    lawColumn:
      "2023年7月の法改正により、電動キックボードは「特定小型原動機付自転車」として位置づけられました。16歳以上であれば免許不要で運転できますが、ヘルメット着用は努力義務です。",
    relatedArticles: [
      {
        lawId: "mock-law-3",
        articleId: "mock-article-3-1",
        relevanceNote: "運転中の注意義務について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-10T09:30:00Z"),
    createdAt: new Date("2025-01-10T09:30:00Z"),
    updatedAt: new Date("2025-01-10T09:30:00Z"),
  },
  {
    id: "mock-news-12",
    articleId: "mock-article-id-12",
    title: "【モック】副業解禁企業が過半数に 労働契約のあり方に変化",
    description:
      "副業を認める企業が過半数を超え、労働契約や労働時間管理のあり方に変化が生じています。",
    link: "https://example.com/news/12",
    ogImage: "https://picsum.photos/seed/mock-news-12/800/450",
    aiEstimatedLaws: ["労働基準法"],
    lawRelevanceNotes: [
      {
        lawName: "労働基準法",
        relevanceNote:
          "副業を行う場合、労働時間は通算されるため、本業と副業を合わせた労働時間管理が必要です。",
      },
    ],
    lawColumnTitle: "副業と労働時間の通算",
    lawColumn:
      "労働基準法では、複数の事業場で働く場合、労働時間を通算することになっています。副業解禁に伴い、適正な労働時間管理の重要性が増しています。",
    relatedArticles: [
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-1",
        relevanceNote: "法定労働時間と時間外労働について",
      },
      {
        lawId: "mock-law-2",
        articleId: "mock-article-2-2",
        relevanceNote: "割増賃金の計算について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-09T14:00:00Z"),
    createdAt: new Date("2025-01-09T14:00:00Z"),
    updatedAt: new Date("2025-01-09T14:00:00Z"),
  },
  {
    id: "mock-news-13",
    articleId: "mock-article-id-13",
    title: "【モック】相続法改正で配偶者の住居権を保護 新制度開始",
    description:
      "相続法改正により、配偶者が自宅に住み続けられる「配偶者居住権」の制度が本格運用されています。",
    link: "https://example.com/news/13",
    ogImage: "https://picsum.photos/seed/mock-news-13/800/450",
    aiEstimatedLaws: ["民法"],
    lawRelevanceNotes: [
      {
        lawName: "民法",
        relevanceNote:
          "2020年の民法改正で創設された配偶者居住権により、相続後も配偶者の居住権が保護されます。",
      },
    ],
    lawColumnTitle: "配偶者居住権の概要",
    lawColumn:
      "配偶者居住権は、被相続人の配偶者が相続開始時に居住していた建物に、終身または一定期間、無償で住み続けることができる権利です。",
    relatedArticles: [
      {
        lawId: "mock-law-4",
        articleId: "mock-article-4-2",
        relevanceNote: "法律行為の有効性について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-08T11:45:00Z"),
    createdAt: new Date("2025-01-08T11:45:00Z"),
    updatedAt: new Date("2025-01-08T11:45:00Z"),
  },
  {
    id: "mock-news-14",
    articleId: "mock-article-id-14",
    title: "【モック】飲酒検問強化 年末年始の交通事故防止キャンペーン",
    description:
      "年末年始の飲酒運転事故防止のため、警察が全国で飲酒検問を強化しています。",
    link: "https://example.com/news/14",
    ogImage: "https://picsum.photos/seed/mock-news-14/800/450",
    aiEstimatedLaws: ["道路交通法"],
    lawRelevanceNotes: [
      {
        lawName: "道路交通法",
        relevanceNote:
          "飲酒運転は道路交通法で厳しく禁止されており、違反には厳罰が科されます。",
      },
    ],
    lawColumnTitle: "飲酒運転の厳罰化",
    lawColumn:
      "道路交通法では、酒気帯び運転と酒酔い運転を区別して処罰しています。特に酒酔い運転は5年以下の懲役または100万円以下の罰金という重い刑罰が科されます。",
    relatedArticles: [
      {
        lawId: "mock-law-3",
        articleId: "mock-article-3-1",
        relevanceNote: "運転者の義務規定について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-07T08:30:00Z"),
    createdAt: new Date("2025-01-07T08:30:00Z"),
    updatedAt: new Date("2025-01-07T08:30:00Z"),
  },
  {
    id: "mock-news-15",
    articleId: "mock-article-id-15",
    title: "【モック】マイナンバーと個人情報 安全な利活用に向けた議論",
    description:
      "マイナンバー制度の利活用拡大に伴い、個人情報保護との両立について専門家が提言をまとめました。",
    link: "https://example.com/news/15",
    ogImage: "https://picsum.photos/seed/mock-news-15/800/450",
    aiEstimatedLaws: ["個人情報の保護に関する法律"],
    lawRelevanceNotes: [
      {
        lawName: "個人情報の保護に関する法律",
        relevanceNote:
          "マイナンバーは特に厳格な管理が求められる個人情報であり、取り扱いには細心の注意が必要です。",
      },
    ],
    lawColumnTitle: "マイナンバーの保護",
    lawColumn:
      "マイナンバーは行政手続における特定の個人を識別するための番号であり、個人情報保護法に加えてマイナンバー法による厳格な規制が適用されます。",
    relatedArticles: [
      {
        lawId: "mock-law-1",
        articleId: "mock-article-1-1",
        relevanceNote: "個人情報保護の基本理念について",
      },
      {
        lawId: "mock-law-1",
        articleId: "mock-article-1-2",
        relevanceNote: "個人情報の適正取得について",
      },
    ],
    hasValidLaws: true,
    publishedAt: new Date("2025-01-06T16:00:00Z"),
    createdAt: new Date("2025-01-06T16:00:00Z"),
    updatedAt: new Date("2025-01-06T16:00:00Z"),
  },
];
