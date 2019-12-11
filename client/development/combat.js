require("./vector.js")
var player_bones = {
	"SKEL_L_UpperArm": {
		bone_id: 45509,
		threshold: 0.08
	},
	"SKEL_R_UpperArm": {
		bone_id: 40269,
		threshold: 0.08
	},
	"SKEL_L_Forearm": {
		bone_id: 61163,
		threshold: 0.08
	},
	"SKEL_R_Forearm": {
		bone_id: 28252,
		threshold: 0.08
	},
	"SKEL_Head": {
		bone_id: 31086,
		threshold: 0.15
	},
	"SKEL_R_Hand": {
		bone_id: 57005,
		threshold: 0.06
	},
	"SKEL_L_Hand": {
		bone_id: 18905,
		threshold: 0.06
	},
	"SKEL_R_Clavicle": {
		bone_id: 10706,
		threshold: 0.1
	},
	"SKEL_L_Clavicle": {
		bone_id: 64729,
		threshold: 0.1
	},
	"SKEL_Spine0": {
		bone_id: 23553,
		threshold: 0.15
	},
	"SKEL_Spine1": {
		bone_id: 24816,
		threshold: 0.15
	},
	"SKEL_Spine2": {
		bone_id: 24817,
		threshold: 0.15
	},
	"SKEL_Spine3": {
		bone_id: 24818,
		threshold: 0.15
	},
	"SKEL_R_Calf": {
		bone_id: 36864,
		threshold: 0.08
	},
	"SKEL_L_Calf": {
		bone_id: 63931,
		threshold: 0.08
	},
	"SKEL_L_Thigh": {
		bone_id: 58271,
		threshold: 0.08
	},
	"SKEL_R_Thigh": {
		bone_id: 51826,
		threshold: 0.08
	},
	"SKEL_R_Foot": {
		bone_id: 52301,
		threshold: 0.08
	},
	"SKEL_L_Foot": {
		bone_id: 14201,
		threshold: 0.08
	}
}

function getVehiclePassangerEntityFromPosition(hPos, veh) {
	let inVehPlayers = [];
	mp.players.forEachInStreamRange((player) => {
		if (player.vehicle == veh) {
			inVehPlayers.push(player);
		}
	});
	let targetEntity = {
		dist: 9999,
		target: null
	}
	inVehPlayers.forEach(function(player) {
		let pPos = player.position;
		let dist = mp.game.system.vdist2(hPos.x, hPos.y, hPos.z, pPos.x, pPos.y, pPos.z);
		if (dist < targetEntity.dist) {
			targetEntity.dist = dist;
			targetEntity.target = player;
		}
	})
	return targetEntity
}

function getIsHitOnBone(hitPosition, target) {
	let nearest_bone = "";
	let nearest_bone_dist = 99;
	if (target != null) {
		for (let bone in player_bones) {
			let bone_id = player_bones[bone].bone_id;
			let threshold = player_bones[bone].threshold;
			let headPos = mp.players.local.getBoneCoords(12844, 0, 0, 0);
			let pos = target.getBoneCoords(bone_id, 0, 0, 0);
			let raycast = mp.raycasting.testPointToPoint(hitPosition, pos, mp.players.local, (2));
			let hit_dist = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, pos.x, pos.y, pos.z);
			if (hit_dist < 1.6) {
				let vector = new mp.Vector3(hitPosition.x - headPos.x, hitPosition.y - headPos.y, hitPosition.z - headPos.z);
				let dist_aim = mp.game.system.vdist(hitPosition.x, hitPosition.y, hitPosition.z, headPos.x, headPos.y, headPos.z);
				let vectorNear = vector.normalize(dist_aim);
				//....
				let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x, headPos.y, headPos.z);
				let vectorAtPos = vectorNear.multiply(dist);
				let aimdist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z)
				if (nearest_bone_dist > aimdist) {
					if (aimdist <= threshold) {
						nearest_bone = bone;
						nearest_bone_dist = aimdist;
					}
				}
			}
		}
	}
	return {
		hit: (nearest_bone != "" ? true : false),
		bone: nearest_bone,
		dist: nearest_bone_dist
	};
}
var shotgunSpreadData = {
	487013001: {
		spray: 1.5,
		max_dist: 30
	}
}

function getWeaponDetails(weapon) {
	if (shotgunSpreadData[weapon]) return shotgunSpreadData[weapon]
	else return {
		spray: 1.5,
		max_dist: 30
	};
}

function isWallbugging(target_position) {
	let gun_pos = mp.players.local.getBoneCoords(40269, 0, 0, 0);
	let aim_point = target_position;
	let raycast = mp.raycasting.testPointToPoint(aim_point, gun_pos, mp.players.local, (1 | 2 | 16));
	if (raycast) {
		let hit_pos = raycast.position;
		let entry_point = new mp.Vector3(hit_pos.x - gun_pos.x, hit_pos.y - gun_pos.y, hit_pos.z - gun_pos.z);
		let entry_dist = mp.game.system.vdist(hit_pos.x, hit_pos.y, hit_pos.z, gun_pos.x, gun_pos.y, gun_pos.z);
		let entry_normalize = entry_point.normalize(entry_dist / 2);
		let entry_final_point = entry_normalize.multiply(entry_dist / 2);
		let entry_point_vector = new mp.Vector3(hit_pos.x + entry_final_point.x, hit_pos.y + entry_final_point.y, hit_pos.z + entry_final_point.z)
		let exit_point_vector = new mp.Vector3(hit_pos.x - entry_final_point.x, hit_pos.y - entry_final_point.y, hit_pos.z - entry_final_point.z)
		let entry_point_pos = mp.raycasting.testPointToPoint(entry_point_vector, exit_point_vector, mp.players.local, (1 | 2 | 16));
		let exit_point_pos = mp.raycasting.testPointToPoint(exit_point_vector, entry_point_vector, mp.players.local, (1 | 2 | 16));
		if ((entry_point_pos) && (exit_point_pos)) {
			let dist = mp.game.system.vdist(entry_point_pos.position.x, entry_point_pos.position.y, entry_point_pos.position.z, exit_point_pos.position.x, exit_point_pos.position.y, exit_point_pos.position.z)
			if (dist < 0.45) {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function calculateShotgunPelletsOnPlayers() {
	let hitted_entity = null;
	var gun_pos = mp.players.local.getBoneCoords(40269, 0, 0, 0);
	let aim_point = mp.players.local.aimingAt;
	let raycast = mp.raycasting.testPointToPoint(aim_point, gun_pos, mp.players.local, -1);
	if (!raycast) {
		mp.players.forEachInStreamRange((ped) => {
			if (mp.players.local != ped) {
				let pos = ped.getWorldPositionOfBone(ped.getBoneIndexByName("IK_Head"));
				let raycast1 = mp.raycasting.testPointToPoint(gun_pos, pos, mp.players.local, -1);
				if (!raycast1) {
					let headPos = mp.players.local.getBoneCoords(12844, 0, 0, 0);
					let vector = new mp.Vector3(aim_point.x - headPos.x, aim_point.y - headPos.y, aim_point.z - headPos.z);
					let dist_aim = mp.game.system.vdist(aim_point.x, aim_point.y, aim_point.z, headPos.x, headPos.y, headPos.z);
					let vectorNear = vector.normalize(dist_aim);
					//....
					let dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x, headPos.y, headPos.z);
					let vectorAtPos = vectorNear.multiply(dist);
					let aim_vector = new mp.Vector3(headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z);
					let spray_dist = mp.game.system.vdist(pos.x, pos.y, pos.z, headPos.x + vectorAtPos.x, headPos.y + vectorAtPos.y, headPos.z + vectorAtPos.z)
					let ped_dist = mp.game.system.vdist(pos.x, pos.y, pos.z, gun_pos.x, gun_pos.y, gun_pos.z)
					let w_data = getWeaponDetails(Number(mp.players.local.weapon));
					if (w_data) {
						let spray_size = mp.lerp(0.5, w_data.spray, 1 / w_data.max_dist * ped_dist)
						if (spray_size > w_data.spray) spray_size = w_data.spray;
						let would_hit = false;
						if (spray_size > spray_dist) would_hit = true;
						if (would_hit == true) {
							hitted_entity = ped;
						}
					}
				}
			}
		});
	}
	return hitted_entity;
}
mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
	let weapon_hash = mp.players.local.weapon;
	//
	let ammo = mp.players.local.getAmmoInClip(weapon_hash);
	mp.events.callRemote("Combat:FireWeapon", weapon_hash.toString(), ammo);
	if (isWallbugging(targetPosition) == false) {
		if (targetEntity) {
			if (targetEntity.isInAnyVehicle(false)) {
				let vehicle = targetEntity.vehicle;
				let result = getVehiclePassangerEntityFromPosition(targetPosition, vehicle)
				let entityHit = getIsHitOnBone(targetPosition, result.target)
				if (entityHit.hit == true) {
					mp.events.callRemote("Combat:HitEntity", result.target, weapon_hash);
				} else {
					mp.events.callRemote("Combat:HitVehicle", vehicle, weapon_hash);
				}
			} else {
				mp.events.callRemote("Combat:HitEntity", targetEntity, weapon_hash);
			}
		} else {
			if (mp.game.weapon.getWeapontypeGroup(weapon_hash) == 860033945) {
				let e = calculateShotgunPelletsOnPlayers();
				if (e != null) {
					mp.events.callRemote("Combat:HitEntity", e, weapon_hash);
				}
			}
		}
	}
});
var timerHitmarker = 0;
mp.events.add("render", () => {
	mp.game.player.resetStamina();
	if (!mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
		mp.game.graphics.requestStreamedTextureDict("hud_reticle", true);
	}
	if (mp.game.graphics.hasStreamedTextureDictLoaded("hud_reticle")) {
		if ((Date.now() / 1000 - timerHitmarker) <= 0.1) {
			mp.game.graphics.drawSprite("hud_reticle", "reticle_ar", 0.5, 0.5, 0.025, 0.040, 45, 255, 255, 255, 150);
		}
	}
});
mp.events.add("Combat:HitEntity", () => {
	timerHitmarker = Date.now() / 1000;
});
mp.events.add("Combat:Hitted", (dmg) => {});