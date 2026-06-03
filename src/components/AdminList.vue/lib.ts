export const formFields = [
  {
    key: "name",
    placeholder: "Nome",
    type: "text",
  },
  {
    key: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    key: "password",
    placeholder: "Senha",
    type: "password",
  },
  {
    key: "ramal_number",
    placeholder: "Ramal",
    type: "number",
  },
];

export const avatarColors = [
  "primary",
  "secondary",
  "accent",
  "positive",
  "negative",
];

export const avatarColor = (i: number) => avatarColors[i % avatarColors.length];

export const initials = (name: string) => {
  const parts = name.trim().split(" ");
  return parts[0][0].toUpperCase();
};
