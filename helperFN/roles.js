module.exports = {

  wolfKills: (voters, players) => {
    //iterate over players to see who the wolf or wolves kill
    //iterate over voters, grab id
    //iterate over players and validate votes for wolf v. wolf
    let wolfPlayer = [];
    let wolfCandidate = [];
    let deaths = [];

    if(module.exports.wolfCheck(voters, players)) {

      players.forEach(findWolf => {
        if (findWolf.role === 'wolf') {
          wolfPlayer.push(findWolf);
        }
      })

      voters.forEach(voter => {
        wolfPlayer.forEach(wolf => {
          if (wolf.player.user_id === voter.voter) {
            wolfCandidate.push(voter.candidate);
          }
        });
      });

      players.forEach(player => {
        wolfCandidate.forEach(pray => {
          if (player.player.user_id === pray) {
            deaths.push(player);
          }
        })
      })

      return {players, deaths};
    } else {
      console.log('Invalid wolf voting');
    }

  },

  wolfCheck: (voters, players) => {
    //check if a wolf voted for a wolf
    let isValidVoting = true;
    voters.forEach((voter, i, arr) => {
      let voterUser = voter.voter;
      let candidateUser = voter.candidate;

      let voterRole = "";
      let candidateRole = "";

      players.forEach(player => {
        if (player.player.user_id === voterUser) {
          voterRole = player.role;
        }
        if (player.player.user_id === candidateUser) {
          candidateRole = player.role;
        }
      });

      if (voterRole === 'wolf' && candidateRole === 'wolf') {
        isValidVoting = false;
      }
    });

    return isValidVoting;
  },

  doctorCheck: (voters, players, userThatDies) => {
    //return an object with the modified array of players and array of messages
    let currentDoctor = [];
    let healedCandidate = [];
    let victimsSaved = [];
    let victimsNotSaved = [];
    let healedCandidateWithStatusMessage = [];

    //grabs the player profile for doctors
    players.forEach((player) => {
      if (player.role === 'doctor' && player.status === true) {
        currentDoctor.push(player);
      }
    });

    //see if currentDoctor array is greater than 0
    if (currentDoctor.length === 0) {

      players.forEach(player => {
        userThatDies.forEach(dead => {
          if (player.player.user_id === dead.player.user_id) {
            player.status = false;
          }
        });
      });

      return {players: players, message: ['No players were saved because all the doctors have been mauled.']};
    }

    //grabs who the doctors chose to save
    voters.forEach((voter) => {
      currentDoctor.forEach(doc => {
        if (doc.player.user_id === voter.voter) {
          healedCandidate.push(voter.candidate);
        }
      })
    });

    //filter out the users that were killed vs who was saved by the doctor
    userThatDies.forEach((victim) => {
      healedCandidate.forEach(heal => {
        if (victim.player.user_id === heal) {
          victimsSaved.push(victim);
        } else {
          victimsNotSaved.push(victim);
        }
      });
    });

    //change players status before being returned
    players.forEach(player => {
      victimsNotSaved.forEach(unsaved => {
        if (unsaved.player.user_id === player.player.user_id) {
          player.status = false;
          healedCandidateWithStatusMessage.push(`Player ${unsaved.player.userName} has been brutally mauled.`);
        }
      })

      victimsSaved.forEach(saved => {
        if(saved.player.user_id === player.player.user_id) {
          player.status = true;
          healedCandidateWithStatusMessage.push(`Player ${saved.player.userName} has been healed.`);
        }
      })
    })

    console.log({players, deaths: victimsSaved});

    return {players, deaths: victimsSaved};
  },

  seerCheck: (voters, players) => {
    let currentSeer = [];
    // let currentWolf = [];
    let seerCandidate = [];
    // let caughtAWolf = [];
    let seerRole = [];

    //Grab the wolf and seer roles
    players.forEach(player => {
      if (player.role === "seer" && player.status) {
        currentSeer.push(player);
      }
      // if (player.role === 'wolf') {
      //   currentWolf.push(player);
      // }
    });

    if(currentSeer.length === 0) {
      return [];
    }

    voters.forEach(voter => {
      currentSeer.forEach(seer => {
        if (voter.voter === seer.player.user_id) {
          seerCandidate.push(voter.candidate);
        }
      });
    });

    players.forEach(player => {
      seerCandidate.forEach(user => {
        if (player.player.user_id === user) {
          seerRole.push(player);
      });
    });

    return seerRole; //array of objects user_id & userName of seer, target: seerRole
  },

};

let sampleVotersSaved = [
  {
    voter: 'cihad',
    candidate: 'josh'
  },
  {
    voter: 'tony',
    candidate: 'josh'
  },
  {
    voter: 'david',
    candidate: 'tony'
  },
];

let samplePlayersSaved = [
  {
    player: {user_id:'tony', userName: 'tony'},
    status: true,
    role: 'doctor',
  },
  {
    player: {user_id: 'cihad', userName: 'cihad'},
    status: true,
    role: 'wolf',
  },
  {
    player: {user_id: 'david', userName:'david'},
    status: true,
    role: 'wolf',
  },
  {
    player: {user_id: 'josh', userName:'josh'},
    status: true,
    role: 'villager',
  },
];

let sampleVotersUnsaved = [
  {
    voter: 'cihad',
    candidate: 'josh'
  },
  {
    voter: 'tony',
    candidate: 'tony'
  },
  {
    voter: 'david',
    candidate: 'tony'
  }
];

let samplePlayersUnsaved = [
  {
    player: {user_id:'tony', userName: 'tony'},
    status: true,
    role: 'doctor',
  },
  {
    player: {user_id: 'cihad', userName: 'cihad'},
    status: true,
    role: 'wolf',
  },
  {
    player: {user_id: 'david', userName:'david'},
    status: true,
    role: 'wolf',
  },
  {
    player: {user_id: 'josh', userName:'josh'},
    status: true,
    role: 'villager',
  },
];

let wolfAttack = [
    {
      player: {user_id:'tony', userName: 'tony'},
      status: true,
      role: 'doctor',
    },
    {
      player: {user_id:'josh', userName: 'josh'},
      status: true,
      role: 'villager',
    },
];

// let test1 = module.exports.doctorCheck(sampleVotersSaved, samplePlayersSaved, wolfAttack);

let test2 = module.exports.wolfKills(sampleVotersSaved, samplePlayersSaved);

