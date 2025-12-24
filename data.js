export const FLOWERS = [
    // Long-lasting (4)
    {
        id: "carnation_white",
        name: "Dianthus caryophyllus",
        commName: "Белая Гвоздика",
        type: "long_lasting",
        stats: { freshness: 14, effect: 0.3, compatibility: 0.8, refinement: 0.2, volume: 2 },
        origin: "Colombia",
        basePrice: 5
    },
    {
        id: "chrysanthemum_yellow",
        name: "Chrysanthemum indicum",
        commName: "Желтая Хризантема",
        type: "long_lasting",
        stats: { freshness: 12, effect: 0.4, compatibility: 0.6, refinement: 0.1, volume: 4 },
        origin: "Netherlands",
        basePrice: 6
    },
    {
        id: "alstroemeria_pink",
        name: "Alstroemeria aurea",
        commName: "Розовая Альстромерия",
        type: "long_lasting",
        stats: { freshness: 10, effect: 0.5, compatibility: 0.9, refinement: 0.3, volume: 3 },
        origin: "Ecuador",
        basePrice: 7
    },
    {
        id: "statice_purple",
        name: "Limonium sinuatum",
        commName: "Статица Фиолетовая",
        type: "long_lasting",
        stats: { freshness: 20, effect: 0.2, compatibility: 1.0, refinement: 0.0, volume: 2 },
        origin: "Israel",
        basePrice: 4
    },

    // Effective but short-lived (4)
    {
        id: "peony_pink",
        name: "Paeonia lactiflora",
        commName: "Пион Сара Бернар",
        type: "effective",
        stats: { freshness: 4, effect: 1.0, compatibility: 0.5, refinement: 0.7, volume: 8 },
        origin: "Holland",
        basePrice: 15
    },
    {
        id: "hydrangea_blue",
        name: "Hydrangea macrophylla",
        commName: "Гортензия Голубая",
        type: "effective",
        stats: { freshness: 3, effect: 0.9, compatibility: 0.4, refinement: 0.5, volume: 10 },
        origin: "Colombia",
        basePrice: 12
    },
    {
        id: "poppy_red",
        name: "Papaver rhoeas",
        commName: "Красный Мак",
        type: "effective",
        stats: { freshness: 2, effect: 0.8, compatibility: 0.3, refinement: 0.6, volume: 1 },
        origin: "Local",
        basePrice: 8
    },
    {
        id: "dahlia_orange",
        name: "Dahlia pinnata",
        commName: "Георгин Оранжевый",
        type: "effective",
        stats: { freshness: 5, effect: 0.85, compatibility: 0.5, refinement: 0.4, volume: 6 },
        origin: "Mexico",
        basePrice: 10
    },

    // Rare (3)
    {
        id: "orchid_vanda",
        name: "Vanda coerulea",
        commName: "Орхидея Ванда",
        type: "rare",
        stats: { freshness: 8, effect: 0.9, compatibility: 0.2, refinement: 1.0, volume: 4 },
        origin: "Thailand",
        basePrice: 25
    },
    {
        id: "protea_king",
        name: "Protea cynaroides",
        commName: "Королевская Протея",
        type: "rare",
        stats: { freshness: 15, effect: 1.0, compatibility: 0.1, refinement: 0.9, volume: 9 },
        origin: "South Africa",
        basePrice: 30
    },
    {
        id: "calla_black",
        name: "Zantedeschia aethiopica",
        commName: "Черная Калла",
        type: "rare",
        stats: { freshness: 7, effect: 0.7, compatibility: 0.8, refinement: 0.95, volume: 2 },
        origin: "Kenya",
        basePrice: 20
    },

    // Balanced (4)
    {
        id: "rose_red",
        name: "Rosa rubiginosa",
        commName: "Роза Гран При",
        type: "balanced",
        stats: { freshness: 7, effect: 0.7, compatibility: 0.7, refinement: 0.5, volume: 3 },
        origin: "Ecuador",
        basePrice: 9
    },
    {
        id: "tulip_red",
        name: "Tulipa gesneriana",
        commName: "Красный Тюльпан",
        type: "balanced",
        stats: { freshness: 6, effect: 0.6, compatibility: 0.8, refinement: 0.4, volume: 2 },
        origin: "Holland",
        basePrice: 5
    },
    {
        id: "lily_white",
        name: "Lilium candidum",
        commName: "Лилия Белая",
        type: "balanced",
        stats: { freshness: 8, effect: 0.8, compatibility: 0.5, refinement: 0.6, volume: 5 },
        origin: "France",
        basePrice: 11
    },
    {
        id: "gerbera_mix",
        name: "Gerbera jamesonii",
        commName: "Гербера Микс",
        type: "balanced",
        stats: { freshness: 9, effect: 0.5, compatibility: 0.9, refinement: 0.2, volume: 4 },
        origin: "Israel",
        basePrice: 6
    }
];

export const REQUESTS = [
    {
        text: "Букет учителю на 1 сентября. Чтобы долго стоял.",
        expectations: { freshness: 10, composition: 0.5, effect: 0.3, refinement: 0.1, volume: 10 },
        budget: 150
    },
    {
        text: "Девушке на свидание, нужно что-то яркое и эффектное!",
        expectations: { freshness: 3, composition: 0.4, effect: 0.8, refinement: 0.3, volume: 5 },
        budget: 200
    },
    {
        text: "Юбилей у бабушки, нужен большой и пышный букет.",
        expectations: { freshness: 5, composition: 0.6, effect: 0.5, refinement: 0.2, volume: 25 },
        budget: 350
    },
    {
        text: "Извинение перед женой. Нужно что-то очень изысканное.",
        expectations: { freshness: 5, composition: 0.7, effect: 0.6, refinement: 0.8, volume: 8 },
        budget: 500
    },
    {
        text: "Просто в вазу на кухню. Что-нибудь простенькое и свежее.",
        expectations: { freshness: 8, composition: 0.3, effect: 0.2, refinement: 0.0, volume: 5 },
        budget: 80
    },
    {
        text: "Коллеге на день рождения. Строго и со вкусом.",
        expectations: { freshness: 6, composition: 0.8, effect: 0.4, refinement: 0.5, volume: 10 },
        budget: 180
    },
    {
        text: "На свадьбу подруге. Нужно что-то нежное и редкое.",
        expectations: { freshness: 5, composition: 0.6, effect: 0.7, refinement: 0.7, volume: 15 },
        budget: 400
    },
    {
        text: "Маме просто так. Она любит тюльпаны.",
        expectations: { freshness: 5, composition: 0.5, effect: 0.4, refinement: 0.3, volume: 8 },
        budget: 120
    },
    {
        text: "Дочке на выпускной. Ярко и современно.",
        expectations: { freshness: 4, composition: 0.6, effect: 0.8, refinement: 0.4, volume: 12 },
        budget: 250
    },
    {
        text: "Начальнице. Дорого-богато, чтобы впечатлить.",
        expectations: { freshness: 6, composition: 0.5, effect: 0.9, refinement: 0.6, volume: 20 },
        budget: 600
    },
    {
        text: "В подарок артисту. Эпатажно и необычно.",
        expectations: { freshness: 3, composition: 0.3, effect: 0.95, refinement: 0.8, volume: 10 },
        budget: 300
    },
    {
        text: "На первое свидание, скромный комплимент.",
        expectations: { freshness: 4, composition: 0.6, effect: 0.3, refinement: 0.4, volume: 3 },
        budget: 60
    },
    {
        text: "Оформление стола на банкет. Низкий и широкий, стойкий.",
        expectations: { freshness: 9, composition: 0.8, effect: 0.5, refinement: 0.3, volume: 15 },
        budget: 220
    },
    {
        text: "В больницу, навестить друга. Без резкого запаха, стойкий.",
        expectations: { freshness: 10, composition: 0.7, effect: 0.2, refinement: 0.2, volume: 6 },
        budget: 100
    },
    {
        text: "Любовнице... Только тсс! Максимально роскошно.",
        expectations: { freshness: 5, composition: 0.5, effect: 0.9, refinement: 0.9, volume: 15 },
        budget: 800
    },
    {
        text: "Венок на дверь. Из сухоцветов или того, что долго стоит.",
        expectations: { freshness: 15, composition: 0.9, effect: 0.3, refinement: 0.1, volume: 8 },
        budget: 150
    },
    {
        text: "Для фотосессии. Важен только внешний вид, завянет - не страшно.",
        expectations: { freshness: 1, composition: 0.4, effect: 1.0, refinement: 0.5, volume: 14 },
        budget: 180
    },
    {
        text: "Партнерам из Японии. Минимализм и утонченность.",
        expectations: { freshness: 6, composition: 0.9, effect: 0.4, refinement: 0.9, volume: 5 },
        budget: 450
    },
    {
        text: "Бабушке на дачу. Что-то пестрое.",
        expectations: { freshness: 7, composition: 0.2, effect: 0.6, refinement: 0.1, volume: 10 },
        budget: 90
    },
    {
        text: "Просто настроение поднять. Собери на свой вкус, но красиво.",
        expectations: { freshness: 5, composition: 0.7, effect: 0.6, refinement: 0.4, volume: 8 },
        budget: 130
    }
];
