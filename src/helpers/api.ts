import { MaybeRef } from "@vueuse/core";
import { useQuery, useMutation } from "villus";
import { DocumentNode } from "graphql";
import { buildAuthorizationHeader } from "./auth";

const GRAPHQL_ERROR_MARKER = 9;

export async function runQuery<T>(
  query: MaybeRef<DocumentNode | string>,
  variables: Record<string, unknown> | null = null,
): Promise<T> {
  const { data, error } = await useQuery({
    query,
    variables,
    cachePolicy: "network-only",
    context: {
      headers: {
        ...buildAuthorizationHeader(),
      },
    },
  }).execute();
  if (error !== null) {
    negativeNotify(error.message.slice(GRAPHQL_ERROR_MARKER));
  }
  return data as T;
}

export async function runMutation<T>(
  query: DocumentNode | string,
  variables: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await useMutation(query, {
    context: {
      headers: {
        ...buildAuthorizationHeader(),
      },
    },
  }).execute(variables);
  if (error !== null) {
    negativeNotify(error.message.slice(GRAPHQL_ERROR_MARKER));
  }
  return data as T;
}
