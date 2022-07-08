const handleIdleMachines = (machines) => {
  const washMachine = machines.filter((machine) => machine.type === 'wash' && machine.status === 0);
  const dryMachine = machines.filter((machine) => machine.type === 'dry' && machine.status === 0);
  const petMachine = machines.filter((machine) => machine.type === 'pet' && machine.status === 0);
  return { wash: washMachine, dry: dryMachine, pet: petMachine };
};

export default handleIdleMachines;
