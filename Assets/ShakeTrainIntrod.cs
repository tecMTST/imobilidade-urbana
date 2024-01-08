using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ShakeTrainIntrod : MonoBehaviour
{

    [SerializeField] float speed = 20.0f; //how fast it shakes
    [SerializeField] float amount = 0.01f; //how much it shakes
    
    void Update()
    {
        transform.position = new Vector3(this.transform.position.x, (Mathf.Sin(Time.time * speed) * amount) - 2.15f, this.transform.position.z);
    }
 
}
