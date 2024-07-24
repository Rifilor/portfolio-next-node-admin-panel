<template>
    <div class="item">
        <div class="item_check-box" v-if="showCheckBox">
            <check-box @select="emit('select')" :value="checked"></check-box>
        </div>
        <template v-for="(valueName, i) in values" :key="i">
            <img class="item__img" v-if="valueName == 'avatar_url'"
                :src="item[valueName] ? item[valueName] : 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'"
                alt="avatar">
            <p class="item__text" :title="getTitle(valueName)" v-else>{{ getText(valueName) }}</p>
        </template>
        <div class="item__delete" v-if="showDeleteButton">
            <button v-on:click="emit('clickDelete')">
                <svg-icon name="delete" />
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
//imports
import { useI18n } from "vue-i18n";
const i18n = useI18n();

//props
const props = defineProps<{
    showDeleteButton?: boolean,
    values: string[],
    item: any,
    showCheckBox?: boolean,
    checked?: boolean,
}>()

//emit
const emit = defineEmits(['clickDelete', 'select'])


//methods
const getTitle = (valueName: string): string => {
    if (valuesNotShowTitle.indexOf(valueName) == -1) {
        return getText(valueName)
    }
    return ''
}
const getText = (valueName: string): string => {
    let text = ''
    if (props.item[valueName] && valueName == 'position') {
        let array = ['frontend', 'backend', 'ios', 'android']
        text = ' ' + i18n.t(array.indexOf(props.item[valueName]) >= 0 ? 'developer' : 'manager')
    }
    return props.item[valueName] ? props.item[valueName] + text : ''
}

//values
const valuesNotShowTitle: string[] = ['avatar_url']
</script>
<style lang="scss" scoped>
@import '../../assets/style/mixins.scss';

.item {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 8px;

    &__text {
        @include font(16px);
        @include firstLaterUpercase;
        @include overflowDots;
        color: var(--color-dark);
    }

    &__img {
        height: 35px;
        width: 35px;
        border-radius: 90px;
    }

    &__delete {
        @include flex-center;

        svg {
            width: 15px;
            height: 15px;
        }
    }
}
</style>