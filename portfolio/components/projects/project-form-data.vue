<!-- eslint-disable vue/no-mutating-props -->
<template>
    <form @submit.prevent="onSubmit" class="form" v-if="itemEdit">
        <div class="block-input">
            <p class="block-input__text">{{ $t('name') }}</p>
            <input required v-model="itemEdit.name" type="text" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('status') }}</p>
            <dropdown :list="store.$state.statusList" :use-localization="true" :watch-value="'name'"
                @change="itemEdit.status = positionDropValue ? positionDropValue.type : null" class="block-input__input"
                v-model="positionDropValue" :id-value="'type'" />
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('budget') }}</p>
            <input required v-model="itemEdit.budget" type="number" class="block-input__input">
        </div>



        <div class="block-input">
            <p class="block-input__text">{{ $t('start_date') }}</p>
            <datepicker-input :required="true" class="block-input__input"
                v-model="itemEdit.start_date"></datepicker-input>
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('end_date') }}</p>
            <datepicker-input :required="true" class="block-input__input"
                v-model="itemEdit.end_date"></datepicker-input>
        </div>

        <div class="block-input">
            <p class="block-input__text">{{ $t('description') }}</p>
            <textarea v-model="itemEdit.description" type="text" class="block-input__input" />
        </div>
        <div class="form__wrap-buttons">
            <nuxt-link :to="localePath(pathCancel)" class="form__cancel">{{ $t('cancel') }}</nuxt-link>
            <button class="form__submit" type="submit">{{ $t(textButton) }}</button>

        </div>
    </form>
</template>
<script setup lang="ts">
//imports
import type { ProjectInterface } from '../../interface/interface.ts'
import { useStore } from '../../stores/store.ts'
const store = useStore()

//props
const props = defineProps<{
    itemEdit: ProjectInterface | null,
    textButton: string,
    pathCancel?: string,
}>()

//emit
const emit = defineEmits(['onSubmit'])

//values
const positionDropValue: Ref<listDropSimpleInterface | null> = ref(null)

//methods
const onSubmit = (): void => {
    emit('onSubmit')
}

//computed
const getItemDropMount = computed((): listDropSimpleInterface | null => {
    if (props.itemEdit) {
        const item: listDropSimpleInterface | null = store.$state.statusList.find(el => el.type == props.itemEdit.status)
        return item ? item : null
    }
    return null
})

//hook
onMounted((): void => {
    positionDropValue.value = getItemDropMount.value
})


</script>
<style lang="scss" scoped>
@import '../assets/style/mixins.scss';

.block-input {
    width: 400px;
    margin-top: 20px;

    &__text {
        @include font(17px);
        @include firstLaterUpercase;
    }

    &__input {
        margin-top: 8px;

    }
}

.form {
    &__wrap-buttons {
        margin-top: 25px;

        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    &__submit {
        @include button-style(150px);
    }

    &__cancel {
        margin-right: 15px;
        @include button-text-gray(15px);
    }
}
</style>