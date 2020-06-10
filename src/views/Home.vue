<template>
  <div class="home">
    <div class="image-container">
      <b-img class="image-container__image" src="@/assets/background.jpg" />
    </div>
    <div class="main-content__container d-flex justify-content-center align-items-center">
      <div class="main-content__area">
        <h1 class="main-content__game-title display-3 text-light">The name of the game</h1>
        <h4 class="main-content__game-description text-light">Description of the game</h4>
        <div class="d-flex justify-content-center mt-5">
          <b-button class="mr-3 py-3 px-4" size="lg" variant="success">Login</b-button>
          <b-button class="ml-3 py-3 px-4" size="lg" variant="outline-info">About</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>

<style scoped lang="scss">

.image-container {
  position: relative;
  z-index: 1;

  & > &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }
}

.main-content {

  &__container {
    position: relative;
    z-index: 2;
    height: 100vh;
    width: 100vw;
  }
}
</style>
