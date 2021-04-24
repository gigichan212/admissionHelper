export function updateNavBarStatus() {
  return {
    type: "@@navBar/updateNavBarStatus" as const,
  };
}

export function setNavBar(isOpen: boolean) {
  return {
    type: "@@navBar/setNavBar" as const,
    isOpen,
  };
}

export type navBarActions = ReturnType<typeof updateNavBarStatus> | ReturnType<typeof setNavBar>;
