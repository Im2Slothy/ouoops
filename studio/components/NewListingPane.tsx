import { Button, Card, Heading, Stack, Text } from "@sanity/ui";
import { useRouter } from "sanity/router";

export function NewListingPane() {
  const router = useRouter();

  return (
    <Card height="fill" style={{ padding: "3rem" }} tone="transparent">
      <Stack space={5} style={{ maxWidth: 560 }}>
        <Heading as="h1" size={3}>Add a new listing</Heading>
        <Text muted size={2}>
          Start here, add the item information and photos, then choose Publish in the lower-right corner.
        </Text>
        <Button
          fontSize={2}
          onClick={() => router.navigateIntent("create", { type: "collectible" })}
          padding={4}
          text="Create a listing"
          tone="primary"
        />
      </Stack>
    </Card>
  );
}
