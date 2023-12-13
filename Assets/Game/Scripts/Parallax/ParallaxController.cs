using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParallaxController : MonoBehaviour
{
    public PlayerController playerController;

    public Transform[] planes;
    public float[] planeVelocity;

    [Range(0, 1)]
    public float velocityScale = 1;


    // Start is called before the first frame update
    void Start() {
        for (int i = 0; i < planes.Length; i++) {

            if (planes[i].CompareTag("moon"))
                continue;

            if (planeVelocity[i] >= 1)
                planes[i].GetComponent<SpriteRenderer>().size *= new Vector2(planeVelocity[i], 1);


        }
    }

    // Update is called once per frame
    void Update()
    {
        Parallaxing();
    }

    void Parallaxing() {

        if (playerController.isMovingLeft && playerController.onLimit == false)             
            for (int i = 0; i < planes.Length; i++) {
                planes[i].position += (planeVelocity[i] * velocityScale) * Time.deltaTime * Vector3.right;
                transform.rotation = Quaternion.identity;
            }


        if (playerController.isMovingRight && playerController.onLimit == false)
            for (int i = 0; i < planes.Length; i++) {
                planes[i].position += (planeVelocity[i] * velocityScale) * Time.deltaTime * Vector3.left;
                transform.rotation = Quaternion.identity;
            }

    }

    

    
}
