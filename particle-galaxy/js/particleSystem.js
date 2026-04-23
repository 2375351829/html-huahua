/**
 * Project: Particle Galaxy · Code is Poetry
 * Author: 2023级软件工程X班 · 姓名
 * Tech Stack: HTML5 Canvas, Vanilla JavaScript
 * Theme: 智创青春 · 艺启未来
 * 
 * "在代码的星河里，每一行都是一首诗；
 *  每一个粒子，都是我们跳动的思维。"
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fpsEl = document.getElementById('fps');
const particlesEl = document.getElementById('particles');
const musicBtn = document.getElementById('music-btn');
const bgm = document.getElementById('bgm');

let width, height;
let particles = [];
let stars = [];
let meteors = [];
let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;
let isMouseDown = false;
let mouseTrail = [];
let explosions = [];
let fireworks = [];
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;
let time = 0;
let clickRings = [];
let effectMode = 0; // 0: normal, 1: trail, 2: explosion, 3: wave
let lastFireworkTime = 0;
let lastMeteorTime = 0;

const PARTICLE_COUNT = 250;
const STAR_COUNT = 150;
const CONNECTION_DISTANCE = 100;
const MOUSE_INFLUENCE = 150;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        const centerX = width / 2;
        const centerY = height / 2;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.min(width, height) * 0.4;
        
        this.x = centerX + Math.cos(angle) * radius;
        this.y = centerY + Math.sin(angle) * radius;
        
        const speed = 0.3 + Math.random() * 0.8;
        this.vx = -Math.sin(angle) * speed;
        this.vy = Math.cos(angle) * speed;
        
        this.radius = 1 + Math.random() * 1.5;
        this.baseHue = 180 + Math.random() * 90;
        this.hue = this.baseHue;
        this.alpha = 0.6 + Math.random() * 0.4;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = 0.01 + Math.random() * 0.01;
        this.rotation = Math.random() * Math.PI * 2;
    }

    update() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const distSquared = dx * dx + dy * dy;
        
        if (distSquared > 0) {
            const dist = Math.sqrt(distSquared);
            this.vx += (dx / dist) * 0.0008;
            this.vy += (dy / dist) * 0.0008;
        }

        const mdx = mouseX - this.x;
        const mdy = mouseY - this.y;
        const mouseDistSquared = mdx * mdx + mdy * mdy;
        const maxMouseDistSquared = MOUSE_INFLUENCE * MOUSE_INFLUENCE;
        
        if (mouseDistSquared < maxMouseDistSquared && mouseDistSquared > 0) {
            const dist = Math.sqrt(mouseDistSquared);
            const force = (MOUSE_INFLUENCE - dist) / MOUSE_INFLUENCE * 0.25;
            this.vx += (mdx / dist) * force;
            this.vy += (mdy / dist) * force;
        }

        this.vx *= 0.985;
        this.vy *= 0.985;

        this.x += this.vx;
        this.y += this.vy;

        this.rotation += this.rotationSpeed;
        this.hue = this.baseHue + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 40;
        this.currentRadius = this.radius + Math.sin(time * this.pulseSpeed * 2 + this.pulseOffset) * 0.8;

        if (this.x < -50 || this.x > width + 50 || 
            this.y < -50 || this.y > height + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        ctx.fill();
        
        if (Math.random() < 0.03) {
            ctx.beginPath();
            ctx.arc(0, 0, this.currentRadius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.15)`;
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.2;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.twinkleSpeed = 0.01 + Math.random() * 0.02;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.depth = Math.random() * 3;
    }

    update() {
        this.currentAlpha = this.alpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.4;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * this.depth, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, ${80 + this.depth * 10}%, ${Math.max(0, this.currentAlpha)})`;
        ctx.fill();
    }
}

class ClickRing {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = 200;
        this.alpha = 1;
        this.hue = 180 + Math.random() * 90;
        this.speed = 4 + Math.random() * 2;
        this.width = 4;
    }

    update() {
        this.radius += this.speed;
        this.alpha -= 0.015;
        this.width = Math.max(1, this.width - 0.05);
        return this.alpha > 0 && this.radius < this.maxRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        ctx.lineWidth = this.width;
        ctx.stroke();
    }
}

class MouseTrail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alpha = 0.8;
        this.radius = 3 + Math.random() * 2;
        this.hue = 180 + Math.random() * 90;
        this.speed = 0.5 + Math.random() * 0.5;
    }

    update() {
        this.alpha -= 0.02;
        this.radius += this.speed;
        return this.alpha > 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        ctx.fill();
    }
}

class Explosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.life = 60;
        this.hue = 180 + Math.random() * 90;
        
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: 1 + Math.random() * 2,
                alpha: 1,
                life: 60
            });
        }
    }

    update() {
        this.life--;
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.alpha -= 0.016;
            p.life--;
        });
        this.particles = this.particles.filter(p => p.life > 0);
        return this.life > 0 && this.particles.length > 0;
    }

    draw() {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue + Math.random() * 30}, 100%, 70%, ${p.alpha})`;
            ctx.fill();
        });
    }
}

class Meteor {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -50;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = 3 + Math.random() * 5;
        this.radius = 2 + Math.random() * 3;
        this.alpha = 0.8 + Math.random() * 0.2;
        this.trailLength = 30 + Math.random() * 20;
        this.trail = [];
    }

    update() {
        this.trail.unshift({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.trailLength) {
            this.trail.pop();
        }
        
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.01;
        
        return this.y < height + 50 && this.alpha > 0;
    }

    draw() {
        this.trail.forEach((point, index) => {
            const trailAlpha = point.alpha * (1 - index / this.trail.length);
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.radius * (1 - index / this.trail.length), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(60, 100%, 70%, ${trailAlpha})`;
            ctx.fill();
        });
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(60, 100%, 90%, ${this.alpha})`;
        ctx.fill();
    }
}

class Firework {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + 50;
        this.targetY = Math.random() * height * 0.6;
        this.vy = -6 - Math.random() * 4;
        this.vx = (Math.random() - 0.5) * 2;
        this.alpha = 1;
        this.hue = Math.random() * 360;
        this.exploded = false;
        this.explosionParticles = [];
    }

    update() {
        if (!this.exploded) {
            this.y += this.vy;
            this.x += this.vx;
            this.vy += 0.1;
            
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.createExplosion();
            }
        } else {
            this.explosionParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.alpha -= 0.01;
                p.life--;
            });
            this.explosionParticles = this.explosionParticles.filter(p => p.life > 0);
        }
        
        return !this.exploded || this.explosionParticles.length > 0;
    }

    createExplosion() {
        for (let i = 0; i < 50; i++) {
            this.explosionParticles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                radius: 1 + Math.random() * 2,
                alpha: 1,
                life: 100,
                hue: this.hue + Math.random() * 30
            });
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            ctx.fill();
        } else {
            this.explosionParticles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
                ctx.fill();
            });
        }
    }
}

function init() {
    resize();
    particles = [];
    stars = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }
}

function drawConnections() {
    const gridSize = CONNECTION_DISTANCE;
    const grid = new Map();
    
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);
        const key = `${gridX},${gridY}`;
        
        if (!grid.has(key)) {
            grid.set(key, []);
        }
        grid.get(key).push(i);
    }
    
    ctx.beginPath();
    
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const gridX = Math.floor(p1.x / gridSize);
        const gridY = Math.floor(p1.y / gridSize);
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${gridX + dx},${gridY + dy}`;
                const neighbors = grid.get(key);
                
                if (neighbors) {
                    for (const j of neighbors) {
                        if (j > i) {
                            const p2 = particles[j];
                            const dx = p1.x - p2.x;
                            const dy = p1.y - p2.y;
                            const distSquared = dx * dx + dy * dy;
                            const maxDistSquared = CONNECTION_DISTANCE * CONNECTION_DISTANCE;
                            
                            if (distSquared < maxDistSquared) {
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                            }
                        }
                    }
                }
            }
        }
    }
    
    const hue = (time * 0.3) % 360;
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.2)`;
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawBackgroundNebula() {
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = 0; i < 3; i++) {
        const radius = Math.min(width, height) * (0.2 + i * 0.18);
        const hue = (time * 0.15 + i * 60) % 360;
        
        const gradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.12)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 70%, 50%, 0.06)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

function animate() {
    time++;
    const currentTime = performance.now();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, width, height);

    drawBackgroundNebula();

    stars.forEach(s => {
        s.update();
        s.draw();
    });

    // 自动生成流星
    if (currentTime - lastMeteorTime > 2000 && meteors.length < 5) {
        meteors.push(new Meteor());
        lastMeteorTime = currentTime;
    }

    // 自动生成烟花
    if (currentTime - lastFireworkTime > 3000 && fireworks.length < 3) {
        fireworks.push(new Firework());
        lastFireworkTime = currentTime;
    }

    // 流星效果
    meteors = meteors.filter(meteor => {
        const alive = meteor.update();
        if (alive) meteor.draw();
        return alive;
    });

    // 烟花效果
    fireworks = fireworks.filter(firework => {
        const alive = firework.update();
        if (alive) firework.draw();
        return alive;
    });

    // 鼠标轨迹效果
    if (isMouseDown || (Math.abs(mouseX - lastMouseX) > 5 || Math.abs(mouseY - lastMouseY) > 5)) {
        if (mouseTrail.length < 20) {
            mouseTrail.push(new MouseTrail(mouseX, mouseY));
        }
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }

    mouseTrail = mouseTrail.filter(trail => {
        const alive = trail.update();
        if (alive) trail.draw();
        return alive;
    });

    // 爆炸效果
    explosions = explosions.filter(explosion => {
        const alive = explosion.update();
        if (alive) explosion.draw();
        return alive;
    });

    particles.forEach(p => {
        p.update();
    });

    drawConnections();

    particles.forEach(p => {
        p.draw();
    });

    clickRings = clickRings.filter(ring => {
        const alive = ring.update();
        if (alive) ring.draw();
        return alive;
    });

    frameCount++;
    if (currentTime - lastTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        fpsEl.textContent = `FPS: ${fps}`;
        particlesEl.textContent = `Particles: ${particles.length}`;
    }

    requestAnimationFrame(animate);
}

function setupAutoPlay() {
    const autoPlayOptions = document.querySelectorAll('input[name="autoPlay"]');
    
    function handleAutoPlayChange() {
        const selectedOption = document.querySelector('input[name="autoPlay"]:checked').value;
        
        switch(selectedOption) {
            case 'muted':
                bgm.muted = true;
                bgm.play().catch(e => console.log('Muted auto play attempt:', e));
                musicBtn.textContent = '🔊 取消静音';
                break;
            case 'interactive':
                bgm.muted = false;
                bgm.pause();
                musicBtn.textContent = '▶ 播放音乐';
                function playOnInteraction() {
                    bgm.play().catch(e => console.log('Interactive play attempt:', e));
                    musicBtn.textContent = '⏸ 暂停音乐';
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                }
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('keydown', playOnInteraction);
                break;
            case 'manual':
                bgm.muted = false;
                bgm.pause();
                musicBtn.textContent = '▶ 播放音乐';
                break;
        }
    }
    
    autoPlayOptions.forEach(option => {
        option.addEventListener('change', handleAutoPlayChange);
    });
    
    handleAutoPlayChange();
}

function setupEffectMode() {
    const effectModeOptions = document.querySelectorAll('input[name="effectMode"]');
    
    function handleEffectModeChange() {
        const selectedOption = document.querySelector('input[name="effectMode"]:checked').value;
        effectMode = parseInt(selectedOption);
    }
    
    effectModeOptions.forEach(option => {
        option.addEventListener('change', handleEffectModeChange);
    });
}

window.addEventListener('resize', () => {
    resize();
    init();
});

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
});

canvas.addEventListener('mouseup', (e) => {
    isMouseDown = false;
});

canvas.addEventListener('click', (e) => {
    clickRings.push(new ClickRing(e.clientX, e.clientY));
});

canvas.addEventListener('dblclick', (e) => {
    explosions.push(new Explosion(e.clientX, e.clientY));
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

musicBtn.addEventListener('click', () => {
    if (bgm.paused) {
        bgm.play().catch(e => console.log('Play attempt:', e));
        musicBtn.textContent = '⏸ 暂停音乐';
        bgm.muted = false;
    } else {
        bgm.pause();
        musicBtn.textContent = '▶ 播放音乐';
    }
});

init();
setupAutoPlay();
setupEffectMode();
animate();
