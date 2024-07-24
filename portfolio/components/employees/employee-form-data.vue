<!-- eslint-disable vue/no-mutating-props -->
<template>
    <form v-if="itemEdit" class="form" @submit.prevent="onSubmit">
        <div class="block-input">
            <p class="block-input__text">{{ $t('first_name') }}</p>
            <input v-model="itemEdit.first_name" required type="text" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('last_name') }}</p>
            <input v-model="itemEdit.last_name" required type="text" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('avatar') }} (URL)</p>
            <input v-model="itemEdit.avatar_url" type="text" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('phone_number') }}</p>
            <input v-model="itemEdit.phone_number" required type="phone" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('email') }}</p>
            <input v-model="itemEdit.email" required type="email" class="block-input__input">
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('city') }}</p>
            <input v-model="itemEdit.city" required type="text" class="block-input__input">
        </div>
        <div v-if="!clientMode" class="block-input">
            <p class="block-input__text">{{ $t('position') }}</p>
            <dropdown
v-model="positionDropValue" class="block-input__input" :watch-value="'name'" :id-value="'type'" :list="store.$state.pisitionsList"
                :use-localization="false" :localization-additionaly-value="'prefix'" @change="itemEdit.position = positionDropValue ? positionDropValue.type : null"/>
        </div>
        <div class="block-input">
            <p class="block-input__text">{{ $t('born_date') }}</p>
            <datepicker-input v-model="itemEdit.born_date" :required="true" class="block-input__input"/>
        </div>
        <div v-if="!clientMode" class="block-input">
            <p class="block-input__text">{{ $t('start_work') }}</p>
            <datepicker-input
v-model="itemEdit.start_work" :required="true"
                class="block-input__input"/>
        </div>


        <div class="block-input">
            <p class="block-input__text">{{ $t('description') }}</p>
            <textarea v-model="itemEdit.description" type="text" class="block-input__input"/>
        </div>
        <div class="form__wrap-buttons">
            <nuxt-link :to="localePath(pathCancel)" class="form__cancel">{{ $t('cancel') }}</nuxt-link>
            <button class="form__submit" type="submit" >{{ $t(textButton) }}</button>

        </div>

    </form>
</template>
<script setup lang="ts">
//imports
import type { EmployeeInterface, PositionInterface } from '../../interface/interface.ts'
import {useStore} from '../../stores/store.ts'
const store = useStore()

//props
const props = defineProps<{
    clientMode?: boolean,
    itemEdit: EmployeeInterface | null,
    textButton: string,
    pathCancel?: string,
}>()

//emit
const emit = defineEmits(['onSubmit'])

//values
const positionDropValue: Ref<PositionInterface | null> = ref(null)

//methods
const onSubmit = (): void => {
    emit('onSubmit')
}

//computed
const getItemDropMount = computed((): PositionInterface | null => {
    if (props.itemEdit) {
        const item: PositionInterface | null = store.$state.pisitionsList.find(el => el.type == props.itemEdit.position)
        return item ? item : null
    }
    return null
})

//hook
onMounted(()=> {
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