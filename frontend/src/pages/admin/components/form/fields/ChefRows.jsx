import { Stack } from "@chakra-ui/react";
import { useState } from "react";
import Input from "./Input.jsx";
import Row from "../structure/Row.jsx";
import AddChef from "./AddButton.jsx";

const MAX_CHEFS = 5;

export default function ChefRows({ event }) {
  const initialCount = event?.chefs?.length > 0 ? event.chefs.length : 1;
  const [chefCount, setChefCount] = useState(initialCount);

  const canAddMore = chefCount < MAX_CHEFS;

  const renderChefRow = (index) => {
    const isFirstRow = index === 0;
    const chef = event?.chefs?.[index];

    return (
      <Row key={index}>
        <Input
          label={isFirstRow ? "Chef Name" : ""}
          name={`chef_name_${index}`}
          placeholder="Chef name"
          defaultValue={chef?.name || ""}
        />
        <Input
          label={isFirstRow ? "Instagram" : ""}
          name={`chef_instagram_${index}`}
          placeholder="@handle"
          defaultValue={chef?.instagram_handle || ""}
        />
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
