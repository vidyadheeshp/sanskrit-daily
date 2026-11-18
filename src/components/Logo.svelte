<script lang="ts">
  /**
   * The Pratyaham logo mark. FROZEN: this must stay identical to docs/brand/logo/pratyaham-logo.svg
   * (a test compares them). See docs/brand/BRAND.md before changing anything here.
   */
  let { size = 36 }: { size?: number } = $props();
</script>

<svg class="logo" width={size} height={size} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
  <rect width="256" height="256" rx="56" fill="#8a3b12" />
  <path
    d="M44 208 V182 H96 V152 H156 V124 H212 V208 Z"
    fill="#fbf6ec"
    stroke="#fbf6ec"
    stroke-width="12"
    stroke-linejoin="round"
  />
  <path d="M184 30 C206 60 220 82 205 104 C197 115 171 115 163 104 C148 82 162 60 184 30 Z" fill="#e8b04a" />
  <path d="M184 66 C194 81 198 91 191 100 C188 104 180 104 177 100 C170 91 174 81 184 66 Z" fill="#fff3d6" />
</svg>
