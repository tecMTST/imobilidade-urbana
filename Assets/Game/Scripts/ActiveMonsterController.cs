using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActiveMonsterController : MonoBehaviour
{
    public GameObject[] monsterObjects;
    public int[] roomsWithMonster;
    public GameObject player;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        int playerRoom = player.GetComponent<PlayerController>().GetRoomIndex();

        for (int i = 0; i < roomsWithMonster.Length; i++)
        {
            if (playerRoom == roomsWithMonster[i])
            {
                monsterObjects[i].SetActive(true);
            }
            else
            {
                monsterObjects[i].SetActive(false);
            }
        }
    }
}
