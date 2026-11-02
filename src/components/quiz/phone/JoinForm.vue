<script setup lang="ts">
defineProps<{ busy: boolean; error: string }>()
defineEmits<{ join: [] }>()
const pin = defineModel<string>('pin', { required: true })
const name = defineModel<string>('name', { required: true })
</script>

<template>
  <form class="join" @submit.prevent="$emit('join')">
    <p class="lede">Ekrandaki oda numarasını ve adınızı yazın.</p>

    <label class="field">
      <span>Oda numarası</span>
      <input
        v-model="pin"
        class="pin"
        inputmode="numeric"
        pattern="[0-9]{4}"
        maxlength="4"
        autocomplete="off"
        placeholder="0000"
        required
      />
    </label>

    <label class="field">
      <span>Adınız</span>
      <input v-model="name" maxlength="16" autocomplete="nickname" placeholder="Ekranda bu görünecek" required />
    </label>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <button class="primary" :disabled="busy">{{ busy ? 'Katılıyor…' : 'Katıl' }}</button>
  </form>
</template>

<style scoped>
.join {
  display: grid;
  gap: 18px;
}

.lede {
  margin: 0 0 4px;
  font-size: 1.2rem;
}

.field {
  display: grid;
  gap: 6px;
  color: var(--mauve-text);
}

input {
  padding: 14px 16px;
  border: 1.5px solid rgb(255 244 214 / 0.2);
  border-radius: 12px;
  background: #1d0c27;
  color: var(--screen);
  font: inherit;
  font-size: 1.2rem;
  font-weight: 650;
}

input::placeholder {
  color: rgb(179 160 191 / 0.6);
  font-weight: 400;
}

input:focus-visible {
  outline: 3px solid var(--purple);
  outline-offset: 1px;
}

/* the PIN reads like the marquee digits on the big screen */
.pin {
  font-family: var(--display);
  font-size: 2.6rem;
  letter-spacing: 0.3em;
  color: var(--bulb);
  text-align: center;
}

.error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgb(193 18 31 / 0.18);
  box-shadow: inset 0 0 0 1px rgb(193 18 31 / 0.6);
}

.primary {
  margin-top: 6px;
}

.primary:disabled {
  opacity: 0.6;
}
</style>
