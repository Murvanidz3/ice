import { nanoid } from 'nanoid';

export const LABEL_COLORS = [
    { id: 'red', name: 'წითელი', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    { id: 'orange', name: 'ნარინჯისფერი', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    { id: 'amber', name: 'ქარვისფერი', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { id: 'emerald', name: 'ზურმუხტისფერი', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { id: 'cyan', name: 'ცისფერი', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
    { id: 'blue', name: 'ლურჯი', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    { id: 'violet', name: 'იისფერი', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { id: 'pink', name: 'ვარდისფერი', color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
];

export function createMockData() {
    const todoId = nanoid();
    const inProgressId = nanoid();
    const reviewId = nanoid();
    const doneId = nanoid();

    return {
        lists: [
            { id: todoId, title: 'გასაკეთებელი', cardIds: [] },
            { id: inProgressId, title: 'მიმდინარე', cardIds: [] },
            { id: reviewId, title: 'შესამოწმებელი', cardIds: [] },
            { id: doneId, title: 'დასრულებული', cardIds: [] },
        ],
        cards: {},
        listOrder: [todoId, inProgressId, reviewId, doneId],
    };
}

function c(overrides) {
    const id = nanoid();
    return {
        id,
        title: '',
        description: '',
        labels: [],
        checklist: [],
        dueDate: null,
        coverColor: null,
        attachments: [],
        createdAt: new Date().toISOString(),
        ...overrides,
    };
}

// ===== პროექტი 1: კოსმოსური მისია =====
function getCosmicMission() {
    const card1 = c({
        title: 'რაკეტის საწვავის შეკვეთა',
        description: 'ძრავებისთვის საჭიროა 500 ლიტრი კოსმოსური საწვავი. მომწოდებელთან შეთანხმება ფასზე.',
        labels: ['red', 'orange'],
        coverColor: '#ef4444',
        dueDate: '2026-04-15',
    });
    const card2 = c({
        title: 'ასტრონავტების ტრენინგი',
        description: 'გუნდის წევრებმა უნდა გაიარონ ფიზიკური და ფსიქოლოგიური მომზადება.',
        labels: ['blue', 'cyan'],
        checklist: [
            { id: nanoid(), text: 'ფიზიკური მომზადება', checked: true },
            { id: nanoid(), text: 'სიმულატორზე ვარჯიში', checked: true },
            { id: nanoid(), text: 'უწონადობის ტესტი', checked: false },
        ],
    });
    const card3 = c({
        title: 'მარსის რუკის შედგენა',
        labels: ['emerald'],
        coverColor: '#10b981',
    });
    const card4 = c({
        title: 'კომუნიკაციის სისტემის ტესტირება',
        description: 'რადიო კავშირის გამოცდა 300 მლნ კმ მანძილზე.',
        labels: ['violet'],
        dueDate: '2026-03-20',
    });
    const card5 = c({
        title: 'სკაფანდრების შეკერა',
        labels: ['pink', 'amber'],
        checklist: [
            { id: nanoid(), text: 'ზომების აღება', checked: true },
            { id: nanoid(), text: 'მასალის შერჩევა', checked: false },
            { id: nanoid(), text: 'პროტოტიპის შექმნა', checked: false },
        ],
    });
    const card6 = c({
        title: 'კოსმოსური საკვების მომზადება',
        description: '100 დღის საკვები 5 ასტრონავტისთვის. ლიოფილიზირებული პროდუქტები.',
        labels: ['orange'],
        coverColor: '#f97316',
    });

    const data = createMockData();
    data.lists[0].title = 'დაგეგმილი';
    data.lists[1].title = 'მიმდინარე';
    data.lists[2].title = 'ტესტირება';
    data.lists[3].title = 'გაფრენისთვის მზად';
    data.cards = { [card1.id]: card1, [card2.id]: card2, [card3.id]: card3, [card4.id]: card4, [card5.id]: card5, [card6.id]: card6 };
    data.lists[0].cardIds = [card1.id, card3.id];
    data.lists[1].cardIds = [card2.id, card5.id];
    data.lists[2].cardIds = [card4.id];
    data.lists[3].cardIds = [card6.id];
    return data;
}

// ===== პროექტი 2: პიცერია "მთვარე" =====
function getPizzeria() {
    const card1 = c({
        title: 'მენიუს განახლება',
        description: 'დავამატოთ 5 ახალი პიცა: ტროპიკული, შავი კატა, ვულკანი, ოკეანე, მთვარის სხივი.',
        labels: ['amber', 'orange'],
        coverColor: '#f59e0b',
        checklist: [
            { id: nanoid(), text: 'ტროპიკული 🍍', checked: true },
            { id: nanoid(), text: 'შავი კატა 🐈‍⬛', checked: true },
            { id: nanoid(), text: 'ვულკანი 🌋', checked: false },
            { id: nanoid(), text: 'ოკეანე 🦐', checked: false },
            { id: nanoid(), text: 'მთვარის სხივი 🌙', checked: false },
        ],
    });
    const card2 = c({
        title: 'მიტანის სერვისის გაშვება',
        labels: ['blue'],
        dueDate: '2026-03-10',
    });
    const card3 = c({
        title: 'ავეჯის შეძენა ტერასისთვის',
        description: '10 მაგიდა და 40 სკამი. ბიუჯეტი: 8000 ლარი.',
        labels: ['emerald', 'cyan'],
    });
    const card4 = c({
        title: 'ონლაინ შეკვეთის აპი',
        description: 'მობილური აპლიკაცია Android და iOS-ზე. UX დიზაინის ეტაპი.',
        labels: ['violet'],
        coverColor: '#8b5cf6',
        dueDate: '2026-04-01',
    });
    const card5 = c({
        title: 'მზარეულის შერჩევა',
        labels: ['red'],
        checklist: [
            { id: nanoid(), text: 'რეზიუმეების გადარჩევა', checked: true },
            { id: nanoid(), text: 'დეგუსტაციის ტური', checked: false },
        ],
    });

    const data = createMockData();
    data.lists[0].title = 'იდეები';
    data.lists[1].title = 'მუშავდება';
    data.lists[2].title = 'ამოწმებს შეფი';
    data.lists[3].title = 'მზადაა';
    data.cards = { [card1.id]: card1, [card2.id]: card2, [card3.id]: card3, [card4.id]: card4, [card5.id]: card5 };
    data.lists[0].cardIds = [card3.id, card5.id];
    data.lists[1].cardIds = [card1.id, card4.id];
    data.lists[2].cardIds = [card2.id];
    data.lists[3].cardIds = [];
    return data;
}

// ===== პროექტი 3: ფილმის გადაღება =====
function getFilmProduction() {
    const card1 = c({
        title: 'სცენარის გადაწერა',
        description: 'მე-3 აქტი საჭიროებს მეტ დრამას. რეჟისორის შენიშვნები გათვალისწინებული უნდა იყოს.',
        labels: ['violet', 'pink'],
        coverColor: '#8b5cf6',
    });
    const card2 = c({
        title: 'ლოკაციების მოძიება',
        labels: ['emerald'],
        checklist: [
            { id: nanoid(), text: 'ძველი თბილისი', checked: true },
            { id: nanoid(), text: 'მთის სოფელი', checked: true },
            { id: nanoid(), text: 'ზღვის სანაპირო', checked: false },
            { id: nanoid(), text: 'მიტოვებული ქარხანა', checked: false },
        ],
    });
    const card3 = c({
        title: 'მსახიობების კასტინგი',
        description: 'მთავარი როლი: 25-35 წლის, ემოციური, გამოცდილი.',
        labels: ['red', 'amber'],
        dueDate: '2026-03-15',
    });
    const card4 = c({
        title: 'საუნდტრეკის ჩაწერა',
        labels: ['cyan', 'blue'],
        coverColor: '#06b6d4',
    });
    const card5 = c({
        title: 'პოსტერის დიზაინი',
        labels: ['orange'],
    });
    const card6 = c({
        title: 'ტრეილერის მონტაჟი',
        description: '2 წუთიანი ტრეილერი YouTub-ისა და Facebook-ისთვის.',
        labels: ['pink'],
        dueDate: '2026-05-01',
    });

    const data = createMockData();
    data.lists[0].title = 'პრე-პროდაქშენი';
    data.lists[1].title = 'გადაღება';
    data.lists[2].title = 'პოსტ-პროდაქშენი';
    data.lists[3].title = 'გამოსაშვები';
    data.cards = { [card1.id]: card1, [card2.id]: card2, [card3.id]: card3, [card4.id]: card4, [card5.id]: card5, [card6.id]: card6 };
    data.lists[0].cardIds = [card1.id, card2.id, card3.id];
    data.lists[1].cardIds = [];
    data.lists[2].cardIds = [card4.id, card5.id];
    data.lists[3].cardIds = [card6.id];
    return data;
}

// ===== პროექტი 4: სახლის რემონტი =====
function getHomeRenovation() {
    const card1 = c({
        title: 'კედლების შეღებვა',
        description: 'მისაღები: ცისფერი, საძინებელი: კრემისფერი, სამზარეულო: თეთრი.',
        labels: ['blue', 'cyan'],
        coverColor: '#3b82f6',
        checklist: [
            { id: nanoid(), text: 'საღებავის შეძენა', checked: true },
            { id: nanoid(), text: 'ფასადის მომზადება', checked: true },
            { id: nanoid(), text: 'პირველი ფენა', checked: false },
            { id: nanoid(), text: 'მეორე ფენა', checked: false },
        ],
    });
    const card2 = c({
        title: 'სანტექნიკა აბაზანაში',
        labels: ['red'],
        dueDate: '2026-03-25',
    });
    const card3 = c({
        title: 'პარკეტის დაგება',
        description: 'მუხის პარკეტი 85 კვ.მ. ოსტატის გამოძახება ორშაბათს.',
        labels: ['amber', 'orange'],
    });
    const card4 = c({
        title: 'სამზარეულოს კარადები',
        labels: ['emerald'],
        coverColor: '#10b981',
    });
    const card5 = c({
        title: 'ელექტროგაყვანილობის შემოწმება',
        description: 'ელექტრიკოსის ვიზიტი პარასკევს 10:00-ზე.',
        labels: ['violet'],
        dueDate: '2026-03-12',
    });

    const data = createMockData();
    data.lists[0].title = 'შესასყიდი';
    data.lists[1].title = 'მიმდინარე';
    data.lists[2].title = 'ოსტატის ლოდინი';
    data.lists[3].title = 'მზადაა ✅';
    data.cards = { [card1.id]: card1, [card2.id]: card2, [card3.id]: card3, [card4.id]: card4, [card5.id]: card5 };
    data.lists[0].cardIds = [card3.id, card4.id];
    data.lists[1].cardIds = [card1.id];
    data.lists[2].cardIds = [card2.id, card5.id];
    data.lists[3].cardIds = [];
    return data;
}

// ===== პროექტი 5: მარათონის მომზადება =====
function getMarathonPrep() {
    const card1 = c({
        title: 'სავარჯიშო გეგმის შედგენა',
        description: '16 კვირიანი გეგმა: ნელი ჯოგიდან სრულ მარათონამდე.',
        labels: ['emerald', 'cyan'],
        coverColor: '#10b981',
        checklist: [
            { id: nanoid(), text: 'კვირა 1-4: ბაზა', checked: true },
            { id: nanoid(), text: 'კვირა 5-8: მოცულობა', checked: true },
            { id: nanoid(), text: 'კვირა 9-12: ინტენსივობა', checked: false },
            { id: nanoid(), text: 'კვირა 13-16: ტეიპარინგი', checked: false },
        ],
    });
    const card2 = c({
        title: 'სარბენი ფეხსაცმლის შეძენა',
        labels: ['orange'],
        dueDate: '2026-03-05',
    });
    const card3 = c({
        title: 'კვების რეჟიმის განახლება',
        description: 'ნახშირწყლები გაზრდილი, ცილა ყოველ კვებაში. სპორტის დიეტოლოგთან კონსულტაცია.',
        labels: ['amber', 'red'],
    });
    const card4 = c({
        title: 'GPS საათის დაყენება',
        labels: ['blue'],
        coverColor: '#3b82f6',
    });
    const card5 = c({
        title: 'რეგისტრაცია რბოლაზე',
        description: 'თბილისის მარათონი 2026, 42.195 კმ. ადრეული რეგისტრაციის ფასდაკლება 15 მარტამდე.',
        labels: ['pink', 'violet'],
        dueDate: '2026-03-15',
    });
    const card6 = c({
        title: 'საცდელი 21 კმ',
        labels: ['emerald'],
    });

    const data = createMockData();
    data.lists[0].title = 'მოსამზადებელი';
    data.lists[1].title = 'ტრენინგი';
    data.lists[2].title = 'შესამოწმებელი';
    data.lists[3].title = 'შესრულებული 🏅';
    data.cards = { [card1.id]: card1, [card2.id]: card2, [card3.id]: card3, [card4.id]: card4, [card5.id]: card5, [card6.id]: card6 };
    data.lists[0].cardIds = [card2.id, card3.id];
    data.lists[1].cardIds = [card1.id, card6.id];
    data.lists[2].cardIds = [card5.id];
    data.lists[3].cardIds = [card4.id];
    return data;
}

// ===== Default projects =====
export function getInitialData() {
    return getCosmicMission();
}

export function getDefaultProjects() {
    return [
        { id: nanoid(), name: '🚀 კოსმოსური მისია', ...getCosmicMission() },
        { id: nanoid(), name: '🍕 პიცერია "მთვარე"', ...getPizzeria() },
        { id: nanoid(), name: '🎬 ფილმის გადაღება', ...getFilmProduction() },
        { id: nanoid(), name: '🏠 სახლის რემონტი', ...getHomeRenovation() },
        { id: nanoid(), name: '🏃 მარათონის მომზადება', ...getMarathonPrep() },
    ];
}
