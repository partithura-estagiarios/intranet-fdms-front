<template>
  <canvas id="bg-canvas" class="bg-canvas"></canvas>

  <div v-if="isCiron" class="deco">
    <svg
      width="120"
      height="140"
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 130 Q10 10 110 10"
        stroke="white"
        stroke-width="2"
        fill="none"
      />
      <path
        d="M32 130 Q32 32 110 32"
        stroke="white"
        stroke-width="2"
        fill="none"
      />
      <path
        d="M54 130 Q54 54 110 54"
        stroke="white"
        stroke-width="2"
        fill="none"
      />
    </svg>
  </div>

  <div class="fixed-center column">
    <div class="row">
      <q-card class="justify-center shadow-1 my-card q-pa-xl bordered">
        <q-card-section vertical class="q-gutter-md" align="center">
          <q-avatar rounded size="150px">
            <img :src="logoSrc" />
          </q-avatar>
          <p class="text-black text-bold text-h4">{{ titleText }}</p>
        </q-card-section>
        <q-card-section vertical class="q-gutter-md" align="center">
          <h5 class="text-bold text-subtitle1">
            {{ $t("login.enterYourCredentials") }}
          </h5>
          <div class="q-gutter-md">
            <Input :objectInput="loginForm" @dataLogin="handleDataLogin" />
          </div>
          <br />
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            :color="buttonColor"
            size="lg"
            class="relative-position envy full-width"
            :label="$t('login.submitButton')"
            nelevated
            rounded
            @click="submitLoginForm"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Auth } from "../../entities/login";
import { useUsers } from "../../stores/user";
import { BLUE_PALETTE, GRAY_PALETTE } from "./lib";

const router = useRouter();

const userStorage = useUsers();
const { t } = useI18n();

const layout = computed(() => getLayout());
const isCiron = computed(() => layout.value === "CIRON");

const logoSrc = computed(() =>
  isCiron.value ? "/ico/ICO_CIRON.avif" : "/ico/ICO_FUNDIMISA.avif",
);

const titleText = computed(() =>
  isCiron.value ? "INTRANET CIRON" : "INTRANET FUNDIMISA",
);

const buttonColor = computed(() => (isCiron.value ? "orange-14" : "green-8"));

const loginForm: User = reactive({
  labelEmail: "",
  labelInputPassword: "",
});

const handleDataLogin = (form: User) => {
  Object.assign(loginForm, form);
};

const submitLoginForm = async () => {
  const auth: Auth = await userStorage.getUser(loginForm);

  if (auth.auth) {
    userStorage.stateUser = auth;
    router.push("/home");
    return positiveNotify(t("login.loginSuccessful"));
  }
  return negativeNotify(t("auth.invalidCredentials"));
};

onMounted(() => {
  const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d")!;

  const ACTIVE_PALETTE = isCiron.value ? GRAY_PALETTE : BLUE_PALETTE;

  canvas.style.backgroundColor = isCiron.value ? "#888584" : "#090f1a";

  const COLS = 9;
  const ROWS = 7;
  let pts: any[] = [];
  let tris: number[][] = [];
  let W = 0,
    H = 0;
  let rafId: number;

  function buildMesh() {
    pts = [];
    const cw = W / (COLS - 1);
    const ch = H / (ROWS - 1);
    const jitter = Math.min(cw, ch) * 0.38;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const bx = c * cw;
        const by = r * ch;
        const edge = c === 0 || c === COLS - 1 || r === 0 || r === ROWS - 1;
        pts.push({
          bx,
          by,
          ox: bx + (edge ? 0 : (Math.random() - 0.5) * jitter),
          oy: by + (edge ? 0 : (Math.random() - 0.5) * jitter),
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          range: jitter * (0.5 + Math.random() * 0.5),
          edge,
          color:
            ACTIVE_PALETTE[Math.floor(Math.random() * ACTIVE_PALETTE.length)],
        });
      }
    }

    tris = [];
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const i = r * COLS + c;
        tris.push([i, i + 1, i + COLS]);
        tris.push([i + 1, i + COLS + 1, i + COLS]);
      }
    }
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildMesh();
    draw();
  }

  function update() {
    for (const p of pts) {
      if (p.edge) continue;
      p.ox += p.vx;
      p.oy += p.vy;
      if (Math.abs(p.ox - p.bx) > p.range) p.vx *= -1;
      if (Math.abs(p.oy - p.by) > p.range) p.vy *= -1;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const [a, b, c] of tris) {
      const pa = pts[a],
        pb = pts[b],
        pc = pts[c];
      ctx.beginPath();
      ctx.moveTo(pa.ox, pa.oy);
      ctx.lineTo(pb.ox, pb.oy);
      ctx.lineTo(pc.ox, pc.oy);
      ctx.closePath();
      ctx.fillStyle = pa.color;
      ctx.fill();

      ctx.strokeStyle = isCiron.value
        ? "rgba(0,0,0,0.06)"
        : "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }
  let resizeTimeout: any;

  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
      resize();
    }, 50);
  });

  ro.observe(canvas.parentElement!);
  resize();
  loop();

  onUnmounted(() => {
    clearTimeout(resizeTimeout);
    cancelAnimationFrame(rafId);
    ro.disconnect();
  });
});
</script>

<style scoped>
.underline {
  text-decoration: underline;
}

.bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.deco {
  position: fixed;
  bottom: 24px;
  left: 24px;
  opacity: 0.22;
  pointer-events: none;
  z-index: 1;
  animation: decoFloat 7s ease-in-out infinite alternate;
}

@keyframes decoFloat {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-12px);
  }
}
</style>
