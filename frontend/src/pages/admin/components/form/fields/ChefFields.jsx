import { Stack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TypeaheadInput from "../../../../../components/form/TypeaheadInput";
import { fetchChefs } from "../../../../../utils/database/api";
import Row from "../structure/Row.jsx";
import AddChef from "./AddButton.jsx";

// TODO: Merge the two TypeaheadInput instances into one modular component
const MAX_CHEFS = 5;

export default function ChefFields({ event }) {
  const initialCount = event?.chefs?.length > 0 ? event.chefs.length : 1;
  const [chefCount, setChefCount] = useState(initialCount);
  const [chefData, setChefData] = useState([]); 

  // Initialize chef values from event data
  const initialChefs = Array.from({ length: MAX_CHEFS }, (_, i) => ({
    name: event?.chefs?.[i]?.name || "",
    instagram: event?.chefs?.[i]?.instagram_handle || ""
  }));
  const [chefs, setChefs] = useState(initialChefs);

  // Fetch chef data on mount
  useEffect(() => {
    fetchChefs()
      .then(data => setChefData(data)) 
      .catch(err => console.log('[ERROR] Failed to fetch chefs:', err));
  }, []);

  // Check if last chef row has both fields filled
  const lastChefIndex = chefCount - 1;
  const lastChefFilled = chefs[lastChefIndex].name && chefs[lastChefIndex].instagram;

  const canAddMore = chefCount < MAX_CHEFS && lastChefFilled;
  const canRemove = chefCount > 1;

  const handleChefChange = (index, field, value) => {
    const newChefs = [...chefs];
    newChefs[index][field] = value;

    // Auto-fill the other field if this value exists in database
    const matchingChef = chefData.find(chef =>
      field === 'name' ? chef.name === value : chef.instagram === value
    );

    if (matchingChef) {
      // Fill the opposite field automatically
      const oppositeField = field === 'name' ? 'instagram' : 'name';
      newChefs[index][oppositeField] = matchingChef[oppositeField];
    }

    setChefs(newChefs);
  };

  const handleRemoveChef = () => {
    if (canRemove) {
      setChefCount(chefCount - 1);
    }
  };

  const renderChefRow = (index) => {
    const isFirstRow = index === 0;
    const isLastRow = index === chefCount - 1;

    return (
      <Row key={index} position="relative">
        <TypeaheadInput
          label={isFirstRow ? "Chef Name" : ""}
          name={`chef_name_${index}`}
          options={chefData.map(chef => chef.name)}
          value={chefs[index].name}
          onChange={(value) => handleChefChange(index, 'name', value)}
          placeholder=""
        />
        <TypeaheadInput
          label={isFirstRow ? "Instagram" : ""}
          name={`chef_instagram_${index}`}
          options={chefData.map(chef => chef.instagram)}
          value={chefs[index].instagram}
          onChange={(value) => handleChefChange(index, 'instagram', value)}
          placeholder=""
        />
        {isLastRow && canRemove && (
          <Button
            onClick={handleRemoveChef}
            position="absolute"
            right="-40px"
            top={isFirstRow ? "32px" : "4px"}
            size="xs"
            bg="#f36262ff"
            color="white"
            _hover={{ bg: "#e04545" }}
            minW="28px"
            h="28px"
            p={0}
            fontSize="16px"
          >
            ✕
          </Button>
        )}
      </Row>
    );
  };

  return (
    <Stack gap={4}>
      {Array.from({ length: chefCount }, (_, index) => renderChefRow(index))}
      {canAddMore && (
        <AddChef
          onClick={() => setChefCount(chefCount + 1)}
          label="Add Chef"
        />
      )}
    </Stack>
  );
}
