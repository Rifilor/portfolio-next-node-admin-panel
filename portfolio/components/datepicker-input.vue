<!-- eslint-disable vue/no-deprecated-filter -->
<template>
    <vue-date-picker :format="format" :required="props.required | false" auto-apply :locale="locale == 'ua' ? 'uk' : locale" class="block-input__input"  :enable-time-picker="false"
        v-model="model"></vue-date-picker>
</template>
<script setup lang="ts">
//imports
import moment from 'moment'
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
const { locale } = useI18n()

//model
const model = defineModel()

//props
const props = defineProps<{
    required?: boolean,
}>()

//values
const format = (date) => {

  return moment(date).format('DD.MM.YYYY');
}
</script>
<style lang="scss"></style>