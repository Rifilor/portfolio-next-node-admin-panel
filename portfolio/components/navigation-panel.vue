<template>
    <div class="navigation">
        <div class="navigation__user-info user-block">
            <div class="user-avatar">
                <img v-if="currentUser.avatar_url" class="user-avatar__img" :src="currentUser.avatar_url" alt="avatar">
                <img v-else class="user-avatar__img"  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png" alt="avatar_no_img">
                <NuxtLink :to="'/'+(locale !== 'en' ? locale+'/' : '')+'settings'" class="user-avatar__settings">
                    <svg-icon name="settings" />
                </NuxtLink>
            </div>
            <p class="user-block__text">{{ fullName}}</p>
            
            <nav class="navigation-block navigation__main-part">
                <ul class="navigation-block__list">
                    <li v-for="(item, i) in listLinks" :key="i" class="navigation-block__item">
                        <NuxtLink :class="{'navigation-block__link--active': route.path.indexOf(item.link) >= 0}" class="navigation-block__link" :to="'/'+(locale !== 'en' ? locale+'/' : '')+item.link" > {{ $t(item.name) }} </NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<script setup lang="ts">
//imports
import {useCurrentUserStore} from '../stores/currentUser.ts'
import type {linkItemInterface} from '../interface/interface.ts'
const storeCurrentUser = useCurrentUserStore()
const currentUser = storeCurrentUser.getCurrentUser
const {locale} = useI18n()
const route = useRoute()

//computeds
const fullName = computed((): sting => {
    return `${currentUser.first_name} ${currentUser.last_name}`
})

//values
const listLinks : linkItemInterface[] = [
  {name: 'dashboard', link: 'dashboard'},
  {name: 'employees', link: 'employees'},
  {name: 'clients', link: 'clients'},
  {name: 'projects', link: 'projects'},
  ]
</script>
<style lang="scss" scoped>
@import '../assets/style/mixins';
.navigation {
    @include flex-column-center;
    background-color: var(--navigation-panel-bgc);
    &__user-info {
        margin-top: 100px;
    }
    &__main-part {
        margin-top: 100px;
    }
}

.user-avatar {
    position: relative;
    @include flex-center;
    @include square-block(200px, 99px);
    box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.3);
    &__img {
        height: 100%;
        border-radius: 999px;
        
    }
    &__settings {
        @include flex-center;
        box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.4);
        background-color: var(--navigation-panel-bgc);
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 10px;
        svg {
            width: 30px;
            height: 30px;
        }
        border-radius: 50px;
        border: 1px solid var(--color-dark);
        transition: .1s linear;
        &:hover {
            background-color: var(--color-white);
            svg {
                path: {
                    stroke: #222;
                }
            }
        }
    }
}
.user-block {
    @include flex-column-center;
    &__text {
        font-size: 16px;
        max-width: 80%;
        margin-top: 15px;
        font-weight: 500;
        text-align: center;
        word-break: break-word;
    }
}
.navigation-block {
    &__list {
        width: 200px;
        @include flex-column;
        &>*:not(:last-child) {
            margin-bottom: 15px;
        } 
    }
    &__item {
        width:  100%;
    }
    &__link {
        @include firstLaterUpercase;
        display: inline-block;
        font-size: 18px;
        font-weight: 500;
        position: relative;
        color: var(--navigation-link-text-color);
        transition: all 0.2s linear;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background-color: var(--navigation-link-color-hover);
            transition: all 0.2s linear;
        }
        &::before {
            transition: .2s linear;
            opacity: 0;
            content: "";
            @include square-block(5px, 5px, hidden);
            background-color: var(--navigation-link-color-hover);
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(-10px, -50%);
            display: block;
        }
        &:hover {
            // transform: translateX(10px);
            &::after {
                width: 100%;
            }
            // &::before {
            //     opacity: 1;
            // }    
        }

        &--active {
            color: var(--navigation-link-text-color-active);
            transform: translateX(10px);
            &::before {
                opacity: 1;
            } 
            &::after {
                width: 100%;
            }
        }
    }
}
</style>