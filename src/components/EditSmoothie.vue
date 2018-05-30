<template>
  <div v-if="smoothie" class="edit-smoothie container z-depth-1">
    <h2 class="indigo-text center-align">Edit {{ smoothie.title }} Smoothie</h2>
    <form @submit.prevent="editSmoothie">
      <div class="field title">
        <label for="title">Smoothie title:</label>
        <input type="text" name="title" v-model="smoothie.title">
      </div>
      <div v-for="(ing, index) in smoothie.ingredients" class="field ingredient" :key="index">
        <label for="ingredient">Ingredient:</label>
        <input type="text" name="ingredient" v-model="smoothie.ingredients[index]">
        <i class="material-icons delete" @click="deleteIng(ing)">delete</i>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient"><strong>Add an ingredient (press TAB to add):</strong></label>
        <input type="text" name="add-ingredient" @keydown.tab.prevent="addIng" v-model="another">
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Update Smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
  import db from '@/firebase/init'
  import slugify from 'slugify'

  export default {
    name: 'EditSmoothie',
    data(){
      return{
        smoothie: null,
        another: null,
        feedback: null,
        slug: null
      }
    },
    methods: {
      editSmoothie() {
        if (this.smoothie.title) {
          this.feedback = null;
          // Create slug by slugify
          this.smoothie.slug = slugify(this.smoothie.title, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          });
          db.collection('smoothies').doc(this.smoothie.id).update({
            title: this.smoothie.title,
            ingredients: this.smoothie.ingredients,
            slug: this.smoothie.slug
          }).then(() => {
            this.$router.push({ name: 'Index' })
          }).catch(error => {
            console.log(error);
          })
        } else {
          this.feedback = 'You must enter smoothie title';
        }
      },
      addIng(){
        if(this.another){
          this.smoothie.ingredients.push(this.another);
          this.another = null
          this.feedback = null
        } else {
          this.feedback = 'You must enter a value to add another ingredient'
        }
      },
      deleteIng(ing){
        this.smoothie.ingredients = this.smoothie.ingredients.filter(ingredient => {
          return ingredient !== ing
        })
      }
    },
    created(){
      let ref = db.collection('smoothies').where('slug', '==', this.$route.params.smoothie_slug);
      ref.get().then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.data());
          this.smoothie = doc.data();
          this.smoothie.id = doc.id
        })
      })
    }
  }
</script>

<style>
  .edit-smoothie {
    margin-top: 60px;
    padding: 20px;
    min-width: 500px;
  }
  .edit-smoothie h2 {
    font-size: 2em;
    margin: 20px auto;
  }
  .edit-smoothie .field {
    margin: 20px auto;
    position: relative;
  }
  .edit-smoothie .delete {
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom: 16px;
    color: #aaa;
    font-size: 1.4em;
  }
  .add-ingredient label {
    font-size: 1.2em;
  }
</style>