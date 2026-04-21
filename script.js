// Function 방식의 라우팅
function MapsTo(url) {
    window.location.href = url;
}

function navigateTo(url) {
    window.location.href = url;
}

// ==========================================
// 공통 로직 및 랭크 시스템
// ==========================================
function getRankInfo(points) {
    if (points >= 300) return '👑 슬레이트';
    if (points >= 150) return '🎬 티켓';
    if (points >= 50) return '🍿 나초';
    return '🌱 팝콘';
}

function renderUserGreeting() {
    const greetingElement = document.getElementById('user-greeting') || document.getElementById('community-greeting');
    if (!greetingElement) return;

    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
        try {
            const currentUser = JSON.parse(currentUserStr);
            const displayName = currentUser.name || (currentUser.email ? currentUser.email.split('@')[0] : '사용자');
            const rank = currentUser.rank || getRankInfo(currentUser.points || 0);
            greetingElement.innerHTML = `<span style="color:#e50914; margin-right:5px; font-size:1.1rem; vertical-align:middle;">[${rank}]</span>${displayName}님`;
        } catch (e) {}
    } else {
        // 비로그인 상태
        greetingElement.innerText = "게스트님";
    }
}

// 회원가입 폼 처리
function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const isDuplicate = users.some(user => user.email === email);
    
    if (isDuplicate) {
        alert("이미 등록된 이메일입니다.");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        points: 0,
        rank: getRankInfo(0)
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("회원가입이 완료되었습니다! (기본 등급: 🌱 팝콘)");
    navigateTo("login.html");
}

// 로그인 폼 처리
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // 하위 호환: 포인트/랭크가 없는 옛날 아이디면 부여
        if (user.points === undefined) {
            user.points = 0;
            user.rank = getRankInfo(0);
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert("로그인 성공!");
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigateTo("main.html");
    } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
}

// 로그아웃 로직
function logout() {
    localStorage.removeItem('currentUser');
    alert("로그아웃 되었습니다.");
    window.location.replace("main.html");
}

// ==========================================
// ==========================================
// 영화 커뮤니티 Mock Data 및 렌더링 로직
// ==========================================
const defaultCommunityPosts = [
    { id: 1, category: "영화", genre: "스릴러", title: "(약스포) 노멀을 보고", content: "벤 휘틀리 감독이 연출한 <노멀>은 작은 마을에 임시로 부임한 보안관의 이야기를 다루고 있습니다. 눈 덮인 미네소타의 작은 마을에 임시로 부임한 보안관 율리시스. 따로 숙소도 없어 모텔에서 기거합니다. 거기서 강아지를 키우는 여성과 대화를 나누는 정도로 무료함을 달랩니다.", comments: 2, author: "스콜세지", date: "2024-04-18", views: 266, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" },
    { id: 2, category: "이글이글 🔥", title: "[올그린스] 청춘들의 대담한 일탈과 위험한 연대", content: "집이나 학교에서 문제가 있는 세 명의 여고생들이 미래를 위한 돈벌기로 대동단결해서 기상천외한 범죄를 저지르는 청소년 범죄 드라마. 개성있는 3인의 비주얼이나 에너지 넘치는 연기합이 좋아서 흥미롭게 볼 수 있었습니다.", comments: 4, author: "인생은아름다워", date: "2024-04-19", views: 456, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80" },
    { id: 3, category: "영화", title: "[내 이름은] 영화가 끝나도 아무도 일어나지 않는", content: "아시다시피 제주 4.3사건을 다룬 이야기입니다. 무려 3만여명이 희생된 참혹한 역사이며 아직도 이름지어지지 못해 그저 4.3사건이라고만 불립니다. 영화는 이름을 찾아주는 이야기입니다. 잔잔하지만 지루하지 않으며 극의 분위기는 은밀히 고조되다가 눈물이 맺히더라구요.", comments: 6, author: "화기소림", date: "2024-04-18", views: 1941, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80" },
    { id: 4, category: "영화", genre: "로맨스", title: "'The Stranger'에 대한 단상", content: "영화가 시작되면 1940년대 당시의 알제리를 소개하는 화면이 잠시 나온 후에 감옥으로 끌려가는 뫼르소의 모습이 나옵니다. 감방 안에 들어간 뫼르소에게 감방 대행이 어떻게 들어오게 되었냐고 묻고, 그 강렬한 태양 아래서의 살인 사건 회상으로 이어집니다.", comments: 8, author: "네버랜드", date: "2024-04-17", views: 1400, image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80" },
    { id: 5, category: "자유/잡담", title: "요즘 볼만한 한국 영화 추천좀요", content: "추천 부탁드립니다. 스릴러나 액션 쪽이면 제일 좋고 아니면 코미디도 괜찮습니다.", comments: 22, author: "무비스타", date: "2024-04-16", views: 532 },
    { id: 6, category: "공지", title: "MYFLIX 클린 커뮤니티 캠페인 안내", content: "항상 MYFLIX를 사랑해주시는 유저 여러분들께 감사드립니다. 최근 게시판 내 분쟁이 잦아져 클린 캠페인을 실시합니다.", comments: 110, author: "운영자", date: "2024-04-15", views: 3200 }
];

function getCommunityPosts() {
    let posts = JSON.parse(localStorage.getItem('communityPosts'));
    if (!posts || posts.length === 0) {
        posts = defaultCommunityPosts;
        localStorage.setItem('communityPosts', JSON.stringify(posts));
    }
    return posts.sort((a,b) => b.id - a.id); // 최신순 정렬
}

function renderCommunityPosts() {
    const listContainer = document.getElementById("community-board-list");
    if (!listContainer) return; 
    
    listContainer.innerHTML = "";
    
    const params = new URLSearchParams(window.location.search);
    const categoryQuery = params.get('category');
    const genreQuery = params.get('genre');
    
    const boardTitle = document.getElementById("board-title");
    const breadcrumb = document.getElementById("board-breadcrumb");
    
    if (boardTitle) boardTitle.innerText = categoryQuery ? `${categoryQuery} 게시판` : "전체 게시판";
    if (breadcrumb) {
        if (categoryQuery === '영화' && genreQuery) {
            breadcrumb.innerText = `${categoryQuery} > ${genreQuery}`;
        } else if (categoryQuery) {
            breadcrumb.innerText = categoryQuery;
        } else {
            breadcrumb.innerText = "전체";
        }
    }

    // 서브네비게이션 액티브 상태 갱신
    document.querySelectorAll('.subnav-item').forEach(el => el.classList.remove('active'));
    if (categoryQuery) {
        const safeId = "nav-" + categoryQuery.replace(/[\s\/\🔥]/g, '');
        const targetNav = document.getElementById(safeId);
        if (targetNav) targetNav.classList.add('active');
    } else {
        const targetNav = document.getElementById("nav-전체");
        if (targetNav) targetNav.classList.add('active');
    }

    const allPosts = getCommunityPosts();
    let posts = categoryQuery ? allPosts.filter(p => p.category === categoryQuery) : allPosts;
    
    if (categoryQuery === '영화' && genreQuery) {
        posts = posts.filter(p => p.genre === genreQuery);
    }
    
    // 영화 카테고리일 때 장르 서브메뉴 표시 로직
    const genreSubnav = document.getElementById("genre-subnav");
    if (genreSubnav) {
        if (categoryQuery === '영화') {
            genreSubnav.style.display = 'flex';
        } else {
            genreSubnav.style.display = 'none';
        }
    }

    if (posts.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 3rem; color: #888; background:var(--card-bg); border-radius:12px; border:1px solid var(--border-color);">등록된 게시글이 없습니다. 첫 글의 주인공이 되어보세요! 😎</div>`;
        return;
    }

    posts.forEach(post => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.onclick = () => {
            const allStoragePosts = getCommunityPosts();
            const target = allStoragePosts.find(p => p.id === post.id);
            if (target) {
                target.views = (target.views || 0) + 1;
                localStorage.setItem('communityPosts', JSON.stringify(allStoragePosts));
            }
            MapsTo(`post.html?id=${post.id}`);
        };

        const genreLabel = (post.category === '영화' && post.genre) ? `<span style="font-size:0.9rem; color:#888; margin-right:0.3rem;">[${post.genre}]</span>` : '';
        const fallbackImg = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop";
        const thumbSrc = post.image || fallbackImg;

        card.innerHTML = `
            <img src="${thumbSrc}" class="post-thumb" alt="thumbnail">
            <div class="post-content-container">
                <div class="post-header">
                    <h3>${genreLabel}${post.title} 
                        <span class="comment-badge">${post.comments || 0} <span style="font-size:0.7rem;">N</span></span>
                    </h3>
                </div>
                <div class="post-meta">
                    <span class="meta-avatar">👤</span>
                    <span style="font-weight:bold; color:var(--text-color);">${post.author}</span>
                    <span style="color:var(--border-color);">|</span>
                    <span>조회 수 ${post.views || 0}</span>
                    <span style="color:var(--border-color);">|</span>
                    <span>${post.date}</span>
                </div>
                <p class="post-excerpt">${post.content}</p>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function handleWritePost(event) {
    event.preventDefault();
    const currentUserStr = localStorage.getItem('currentUser');
    if (!currentUserStr) {
        alert("로그인 후 이용 가능합니다.");
        navigateTo("login.html");
        return;
    }
    
    let user = JSON.parse(currentUserStr);
    
    // 포인트 증가 및 랭크 산정
    user.points = (user.points || 0) + 10;
    user.rank = getRankInfo(user.points);

    // currentUser 갱신
    localStorage.setItem('currentUser', JSON.stringify(user));

    // users 배열 갱신
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    const authorName = user.name || (user.email ? user.email.split('@')[0] : '사용자');
    
    const category = document.getElementById('post-category').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    let genre = null;
    const genreInput = document.getElementById('post-genre');
    if (category === '영화' && genreInput) {
        genre = genreInput.value;
    }
    
    const posts = getCommunityPosts();
    const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
    const dateObj = new Date();
    const dateStr = dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, '0') + "-" + String(dateObj.getDate()).padStart(2, '0');

    const newPost = {
        id: newId,
        category: category,
        title: title,
        content: content,
        author: authorName,
        date: dateStr,
        views: 0,
        comments: 0
    };

    if (genre) {
        newPost.genre = genre;
    }
    
    posts.push(newPost);
    localStorage.setItem('communityPosts', JSON.stringify(posts));
    
    // 헤더 랭크 갱신 (선택적)
    renderUserGreeting();

    alert(`게시글이 등록되었습니다! (+10점) 현재 등급: ${user.rank}`);
    if (category === '영화') {
        navigateTo(`community.html?category=영화${genre ? '&genre='+genre : ''}`);
    } else {
        navigateTo(`community.html?category=${encodeURIComponent(category)}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderUserGreeting === 'function') renderUserGreeting();
    if (typeof renderCommunityPosts === 'function') renderCommunityPosts();
});
