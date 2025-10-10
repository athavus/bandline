<script lang="ts">
  import { getArtistData } from "./lib/data.ts";
  
  let inputValue = "";
  let dados = null;
  let loading = false;
  let error = null;

  async function searchArtist(value: string) {
    if (!value) {
      return;
    }

    loading = true;
    error = null;
    dados = null;

    try {
      const result = await getArtistData(value);
      dados = result;
    } catch (error) {
      error = "Erro ao buscar artista.";
      console.error(error);
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <input 
    bind:value={inputValue}
    on:input={(e) => searchArtist(e.target.value)}
    type="text" 
    name="input" 
    placeholder="Digite o id do artista" 
  />

  {#if loading}
    <p>Procurando artista...</p>
  {:else if error}
    <p>Erro: {error}</p>
  {:else if dados}
    <p>ID do artista: {dados.id}</p>
    <p>Nome do Artista: {dados.name}</p>
    <p>Número de Seguidores: {dados.total_followers}</p>
  {/if}
</main>

<style>
</style>
