<template>
    <div class="picture" ref="picture" @resize="getWidthPicture">
        <img
            class="picture__img"
            :src="src">
        <b-button
            class="picture__close-btn"
            @click="remove"
            size="sm"
            variant="dark"
        >
        x
        </b-button>
    </div>
</template>

<script>
export default {
    name: "Picture",
    props: {
        src: {
            type: String,
            default: '',
        },
    },
    methods: {
        getWidthPicture(e) {
            this.$emit('width', e)
        },
        remove() {
            this.$emit('removeImg')
        }
    }
}
</script>

<style lang="scss" scoped>
    .picture {
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 30%;
        max-height: 1000px;
        height: fit-content;
        margin: 10px;
        position: relative;
        &:hover {
            .picture__close-btn {
                display: flex;
            }
        }

        @media (max-width: 767px) {
            max-width: 100%;
        }

    }
    .picture__img {
        max-width: 100%;
        object-fit: contain;
    }
    .picture__close-btn {
        display: none;
        position: absolute;
        right: 10px;
        top: 10px;
    }
</style>