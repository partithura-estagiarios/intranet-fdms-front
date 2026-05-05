import action from "./action";
import text from "./text";
import cardDocSig from "./cardDocSig";
import columns from "./columns";
import formRamal from "./formRamal";
import register from "./register";
import tab from "./tab";
import errors from "./errors";
import auth from "./auth";
import userScheduleRoom from "./userScheduleRoom";
import erroRamal from "./erroRamal";
import sucessRamal from "./sucessRamal";
import emailDirector from "./emailDirector";
import files from "./files";
import label from "./label";
import certification from "./certification";

export default {
  certification,
  label,
  emailDirector,
  userScheduleRoom,
  erroRamal,
  sucessRamal,
  action,
  caderno: {
    title: "Notebooks",
    quantidade: "Without notebooks | one notebook | {count} notebooks",
    aumentarQtde: "Increment notebooks",
    addCaderno: "Create notebook",
    form: {
      title: "Title",
      warning: "Please enter a title",
    },
  },
  login: {
    title: "Login",
    labelInputName: "Your user name",
    labelInputPassword: "Your password",
    hintName: "Your registration number",
    hintPassword: "6 first number of your cpf",
    submitButton: "Submit",
    warning: "Please type something!",
  },
  about: "About",
  tags: "Tags",
  tag: {
    create: "Add one or more tags",
  },
  text,
  cardDocSig,
  columns,
  formRamal,
  register,
  tab,
  errors,
  auth,
  files,
};
