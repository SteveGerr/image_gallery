<template>
    <div class="gallery">
        <div class="gallery__input-container">
            <b-form-input size="sm" class="gallery__input-url" ref="enterLink" v-model="imgUrl" type="text" placeholder="Введите адрес изображения"></b-form-input>
            <input ref="changeFiles" type="file" @change="uploadFile">
            <b-button title="Загрузить JSON" size="sm" variant="outline-primary" class="btn-onUpload" @click="onUploadHandler">Загрузить</b-button>
        </div>

        <div class="gallery__image-container" ref="drop_container">
            <div class="gallery__image-container-placeholder" v-if="images.length === 0">Перетащите сюда изображения</div>
            <div class="gallery__image-wrap">
                <Picture
                    :key="i"
                    v-for="(img, i) in images"
                    :src="img.src"
                    @removeImg="onRemove(i)"
                    />
            </div>
        </div>
    </div>
</template>

<script>
import Picture from "../Picture/Picture.vue";
import {mapActions, mapGetters} from 'vuex';
export default {
    name: "Gallery",
    components: {
        Picture
    },
    data() {
        return {
            selectedFile: null, // Загружаемый файл
            files: null, // ФАйлы, загруженные с ПК()
            file: null, // Загруженный через FileReader файл
            imgUrl: "", // Ссылка на картинку
            checkDragnDrop: false, // Доступно ли перетаскивание в браузере
            imgDropFiles: [], // Массив перенесённых(drop) файлов
        }
    },
    mounted() {
        // Проверяем доступность при инициализации
        this.checkDragnDrop = this.onCheckDragnDrop()
        // Ежели, браузер поддерживает
        if (this.checkDragnDrop) {
            // Перебираем массив событий
            ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (drugNdropEvent) {
                // И присваиваем нашему контейнеру
                this.$refs.drop_container.addEventListener(drugNdropEvent, function (e) {
                    // блокируем стандартные поведения
                    e.preventDefault();
                    e.stopPropagation();
                    // Привязываем контекст к событию
                }.bind(this), false);
            }.bind(this));

            this.$refs.drop_container.addEventListener('drop', function(e) {
                this.imgDropFiles.push( e.dataTransfer.files[0] );
                // Перебираем файлы передаваемые пользователем
                for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                    // Пушим в наш подготовленный массив
                    this.getDragImage(e.dataTransfer.files[i]);
                }
                // Связываем наш компонент с этой функцией
            }.bind(this))
        }
    },
    computed: {
        ...mapGetters(['images'])
    },
    methods: {
        ...mapActions(['getImages']),
        // Загрузка с ПК
        uploadFile(eventObj) {

            eventObj.preventDefault();
            this.files = eventObj.target.files;
            // Загружаемый файл
            this.selectedFile = eventObj.target.files[0];

            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.file = fileReader.result
                // Парсим полученный файл и вытягиваем в переменную
                const { galleryImages } =  JSON.parse(this.file)
                // Перебираем галлерею
                galleryImages.forEach(o => {
                    // И диспатчим в массив изображений объект с путём и высотой
                    this.$store.dispatch('actSetImages', {
                        src: o.url || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg",
                        height: o.height || 400
                    })
                });
            })
            // Читаем текст
            fileReader.readAsText(this.selectedFile)
        },
        onUploadHandler() {
            if (this.imgUrl.length === 0) {
                // Ежели, в инпуте ввода ссылки пусто
                // Запускаем загрузку с ПК
                this.$refs.changeFiles.click()

            } else if (/^https?:\/\/\S+(?:jpg|jpeg|png)$/.test(this.imgUrl)) {
                // Иначе, ежели урл прошёл проверку
                // пушим фото по ссылке;
                this.$store.dispatch('actSetImages', {
                    src: this.imgUrl || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                })
            } else {
                alert("Что то пошло не так!")
            }

        },
        // Проверяем поддержку браузером перетаскивания
        onCheckDragnDrop() {
            let div = document.createElement('div');
            return ( ( 'draggable' in div ) || ( 'ondragstart' in div && 'ondrop' in div ) )
            && 'FormData' in window && 'FileReader' in window;
        },

        getDragImage(f) {
            // Проверяем является ли файл картинкой
            if ( /\.(jpe?g|png|gif)$/i.test( f.name ) ) {
            let reader = new FileReader();
            reader.addEventListener("load", function(){
                this.$store.dispatch('actSetImages', {
                    src: reader.result || "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                })
            }.bind(this), false);
            reader.readAsDataURL( f );
            } else {
                alert("Это не картинка!")
            }
        },
        onRemove(index) {
            // Удаляем дропные файлы
            this.imgDropFiles.splice(index, 1);
            // Удаляем объект со ссылкой из хранилища
            this.$store.dispatch('actRemoveImage', index)
        }
    }
}
</script>

<style lang="scss" scoped>
    .gallery {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        max-width: 860px;
        min-width: 320px;
        margin: 30px auto;
        padding: 20px;
        position: relative;
        z-index: 11;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(49, 49, 49, 0.719);
            filter: blur(7px);
            z-index: 10;
        }

        &__image-container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            max-width: 860px;
            min-width: 320px;
            max-height: 80vh;
            min-height: 100px;
            margin: 30px auto;
            overflow-x: hidden;
            z-index: 11;
        }

        &__image-wrap {
            display: flex;
            flex-wrap: wrap;
        }

        &__image-container-placeholder {
            color: #fff;
        }
        &__input-container {
            display: flex;
            width: 100%;
            justify-content: center;
            z-index: 11;
        }
        &__input-url {
            margin-right: 20px;
        }
    }
    input[type="file"] {
        display: none;
    }
    .btn-onUpload {
        width: 100px;
        height: 50px;
    }
</style>