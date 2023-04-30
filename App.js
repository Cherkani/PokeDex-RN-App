import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

const pokemonUrl =
  "https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const groupedPokemon = data.pokemon.reduce((result, p) => {
          const type = p.type[0];
          if (!result[type]) {
            result[type] = [];
          }
          result[type].push({
            id: p.id,
            name: p.name,
            type: p.type,
            img: p.img,
            spawn_chance: p.spawn_chance,
            avg_spawns: p.avg_spawns,
            spawn_time: p.spawn_time,
            multipliers: p.multipliers,
            weaknesses: p.weaknesses,
            prev_evolution:
              p.prev_evolution &&
              p.prev_evolution.map((evolution) => ({
                num: evolution.num,
                name: evolution.name,
                img:
                  data.pokemon.find((p) => p.num === evolution.num)?.img || "",
              })),
            next_evolution:
              p.next_evolution &&
              p.next_evolution.map((evolution) => ({
                num: evolution.num,
                name: evolution.name,
                img:
                  data.pokemon.find((p) => p.num === evolution.num)?.img || "",
              })),
          });
          return result;
        }, {});
        const pokemonList = Object.entries(groupedPokemon).map(
          ([type, pokemon]) => ({
            type,
            pokemon,
          })
        );
        setPokemons(await pokemonList);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching data. Please check your network connection.");
      }
    }

    fetchData();
  }, []);

  const renderItem = ({ item, index }) => {
    const section = pokemons[index];
    const prevType = index > 0 ? pokemons[index - 1].type : null;
    const currType = section.type;

    if (prevType !== currType) {
      return (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{currType}</Text>
          </View>
          <View style={styles.itemContainer}>
            {section.pokemon.map((p) => (
              <TouchableOpacity
                style={styles.item}
                key={p.id}
                onPress={() => setSelectedPokemon(p)}
              >
                <Image style={styles.image} source={{ uri: p.img }} />
                <View style={styles.itemInfo}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.type}>{p.type && p.type.join(", ")}</Text>

                  {/* <Text style={styles.type}>{p.type.join(", ")}</Text> */}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      );
    }

    return (
      <View style={styles.itemContainer}>
        {section.pokemon.map((p) => (
          <TouchableOpacity
            style={styles.item}
            key={p.id}
            onPress={() => setSelectedPokemon(p)}
          >
            <Image style={styles.image} source={{ uri: p.img }} />
            <View style={styles.itemInfo}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.type}>{p.type.join(", ")}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  //view
  // const renderEvolutions = (evolutions, title) => {
  //   if (!evolutions || evolutions.length === 0) {
  //     return null;
  //   }

  //   return (
  //     <>
  //       <Text style={styles.detailsText}>{title}</Text>
  //       <View style={styles.evolutionsContainer}>
  //         {evolutions.map((e) => (
  //           <View style={styles.evolutionContainer} key={e.num}>
  //             {/* <Image style={styles.evolutionImage} source={{ uri: e.img }} /> */}
  //             <Text style={styles.evolutionName}>{`${e.num} - ${e.name}`}</Text>
  //           </View>
  //         ))}
  //       </View>
  //     </>
  //   );
  // };

  //

  const renderDetails = () => {
    if (!selectedPokemon) {
      return null;
    }

    const {
      id,
      name,
      type,
      img,
      spawn_chance,
      avg_spawns,
      spawn_time,
      multipliers,
      weaknesses,
      prev_evolution,
      next_evolution,
    } = selectedPokemon;

    return (
      <View style={styles.detailsContainer}>
        <Image style={styles.detailsImage} source={{ uri: img }} />
        <View style={styles.detailsTextContainer}>
          <Text style={styles.detailsTitle}>{name}</Text>
          <Text style={styles.detailsText}>ID: {id}</Text>
          <Text style={styles.detailsText}>Type: {type.join(", ")}</Text>
          <Text style={styles.detailsText}>Spawn chance: {spawn_chance}</Text>
          <Text style={styles.detailsText}>Average spawns: {avg_spawns}</Text>
          <Text style={styles.detailsText}>Spawn time: {spawn_time}</Text>
          <Text style={styles.detailsText}>
            Weaknesses: {weaknesses.join(", ")}
          </Text>
          <View style={styles.evolutionImagesContainer}>
            {prev_evolution && prev_evolution.length > 0 ? (
              <>
                <Text style={styles.detailsText}>prev evol :</Text>
                {prev_evolution.map((evolution) => (
                  <Image
                    key={evolution.num}
                    style={styles.evolutionImage}
                    source={{ uri: evolution.img }}
                  />
                ))}
              </>
            ) : null}
            {next_evolution && next_evolution.length > 0 ? (
              <>
                <Text style={styles.detailsText}>next evol :</Text>
                {next_evolution.map((evolution) => (
                  <Image
                    key={evolution.num}
                    style={styles.evolutionImage}
                    source={{ uri: evolution.img }}
                  />
                ))}
              </>
            ) : null}
          </View>

          {/* {renderEvolutions(prev_evolution, "Previous evolution:")}
          {renderEvolutions(next_evolution, "Next evolution:")} */}
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={() => setSelectedPokemon(null)}
              backgroundColor="#FF0000"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Pokedex</Text>
      </View>
      {selectedPokemon ? (
        renderDetails()
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item) => item.type}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    maxWidth: 120,
    alignSelf: "center",
  },

  titleBar: {
    backgroundColor: "#f2f2f2",
    padding: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    backgroundColor: "#3f51b5",
    borderRadius: 5,
    padding: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionHeader: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  item: {
    width: "50%",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  type: {
    fontSize: 14,
    color: "#999",
  },
  selectedPokemonContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedPokemonName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  evolutionImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },

  detailsText: {
    fontSize: 16,
    marginBottom: 8,
  },
  evolutionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  evolutionImagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  evolutionImage: {
    width: 75,
    height: 75,
    marginHorizontal: 5,
  },

  evolutionContainer: {
    alignItems: "center",
  },

  button: {
    backgroundColor: "#6495ED",
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
