class Pokedex {
    constructor() {
        this.pokemonList = [];
        this.currentPokemonIndex = 0;
        this.isLoading = false;
        
        // Elementos DOM
        this.pokemonNameElement = document.getElementById('pokemon-name');
        this.pokemonIdElement = document.getElementById('pokemon-id');
        this.pokemonImageElement = document.getElementById('pokemon-img');
        this.prevButton = document.getElementById('prev-btn');
        this.nextButton = document.getElementById('next-btn');
        
        // Event listeners
        this.prevButton.addEventListener('click', () => this.previousPokemon());
        this.nextButton.addEventListener('click', () => this.nextPokemon());
        
        // Inicializar
        this.init();
    }
    
    async init() {
        try {
            await this.loadPokemonList();
            await this.loadPokemon(this.currentPokemonIndex);
        } catch (error) {
            console.error('Erro ao inicializar Pokedex:', error);
            this.showError('Erro ao carregar dados dos Pokémon');
        }
    }
    
    // Carregar lista de todos os Pokémon
    async loadPokemonList() {
        this.setLoading(true);
        
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1292');
            
            if (!response.ok) {
                throw new Error('Erro ao carregar lista de Pokémon');
            }
            
            const data = await response.json();
            this.pokemonList = data.results;
            
            console.log(`Carregados ${this.pokemonList.length} Pokémon`);
        } catch (error) {
            console.error('Erro ao carregar lista:', error);
            throw error;
        } finally {
            this.setLoading(false);
        }
    }
    
    // Carregar dados de um Pokémon específico
    async loadPokemon(index) {
        if (this.pokemonList.length === 0 || index < 0 || index >= this.pokemonList.length) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            const pokemonUrl = this.pokemonList[index].url;
            const response = await fetch(pokemonUrl);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do Pokémon');
            }
            
            const pokemonData = await response.json();
            this.displayPokemon(pokemonData);
            
        } catch (error) {
            console.error('Erro ao carregar Pokémon:', error);
            this.showError('Erro ao carregar Pokémon');
        } finally {
            this.setLoading(false);
        }
    }
    
    // Exibir Pokémon na tela
    displayPokemon(pokemonData) {
        const pokemonNumber = pokemonData.id;
        const pokemonName = pokemonData.name;
        const pokemonImage = pokemonData.sprites.front_default;
        
        // Atualizar elementos DOM
        this.pokemonNameElement.textContent = pokemonName;
        this.pokemonIdElement.textContent = `#${pokemonNumber.toString().padStart(3, '0')}`;
        this.pokemonImageElement.src = pokemonImage;
        this.pokemonImageElement.alt = pokemonName;
        
        console.log(`Pokémon atual: ${pokemonName} (#${pokemonNumber})`);
    }
    
    // Navegar para o próximo Pokémon
    nextPokemon() {
        if (this.isLoading) return;
        
        this.currentPokemonIndex++;
        
        // Se chegou ao último, voltar para o primeiro
        if (this.currentPokemonIndex >= this.pokemonList.length) {
            this.currentPokemonIndex = 0;
        }
        
        this.loadPokemon(this.currentPokemonIndex);
    }
    
    // Navegar para o Pokémon anterior
    previousPokemon() {
        if (this.isLoading) return;
        
        this.currentPokemonIndex--;
        
        // Se chegou ao primeiro, ir para o último
        if (this.currentPokemonIndex < 0) {
            this.currentPokemonIndex = this.pokemonList.length - 1;
        }
        
        this.loadPokemon(this.currentPokemonIndex);
    }
    
    // Controlar estado de carregamento
    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            document.body.classList.add('loading');
            this.prevButton.disabled = true;
            this.nextButton.disabled = true;
        } else {
            document.body.classList.remove('loading');
            this.prevButton.disabled = false;
            this.nextButton.disabled = false;
        }
    }
    
    // Mostrar erro
    showError(message) {
        this.pokemonNameElement.textContent = message;
        this.pokemonIdElement.textContent = '#000';
        this.pokemonImageElement.src = '';
    }
}

// Inicializar a Pokedex quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new Pokedex();
});