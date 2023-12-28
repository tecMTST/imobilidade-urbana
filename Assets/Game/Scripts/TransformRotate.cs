using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TransformRotate : MonoBehaviour {
    [Range(0, 0.5f)]
    public float Velocity;
    
    // Start is called before the first frame update
    void Start()
    {

        
    }

    // Update is called once per frame
    void Update()
    {
        this.transform.Rotate(new Vector3(0, 0, Velocity), 1 * Velocity, Space.World);
       
        
    }

    




}
