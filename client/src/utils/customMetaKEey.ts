export default function customMetaKey({
  ctrlKey,
  metaKey,
}: {
  ctrlKey: boolean;
  metaKey: boolean;
}): boolean {
  const { platform } = window.navigator;

  return (
    (platform.includes('Win') && ctrlKey) ||
    (platform.includes('Mac') && metaKey)
  );
}
