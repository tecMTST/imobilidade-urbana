using UnityEngine;
using System.Collections.Generic;
using Unity.VisualScripting;

public class Monster1 : MonoBehaviour
{
    public float delay = 2f;

    public UnityEngine.Rendering.Universal.Light2D light2D;
    public Transform playerObject;
    public Transform[] targetObject;
    public float moveSpeedNormal = 2f;
    public float moveSpeedLight = 5f;
    private float stoppingDistance = 1f;

    private bool shouldMove = false;
    private Collider2D thisCollider;
    private bool isNearPlayer = false;
    private int index = 0;

    void Start()
    {
        Invoke("StartMoving", delay);
        thisCollider = this.GetComponent<Collider2D>();
    }

    void Update()
    {
        List<Collider2D> colliders = new ();
        ContactFilter2D contactFilter = new ContactFilter2D();
        contactFilter.NoFilter();
        
        thisCollider.OverlapCollider(contactFilter, colliders);

        if (colliders.Exists(item => item.CompareTag("NearPlayer"))) 
        {
            isNearPlayer = true;
        }
        else
        {
            isNearPlayer = false;
        }

        if (light2D.enabled && isNearPlayer)
        {
            Vector3 direction = playerObject.position - transform.position;
            direction.Normalize();
            transform.Translate(direction * moveSpeedLight * Time.deltaTime, Space.World);
        }
        else if (shouldMove)
        {
            Vector3 direction = targetObject[index].position - transform.position;
            

            if (direction.magnitude > stoppingDistance)
            {
                direction.Normalize();
                transform.Translate(direction * moveSpeedNormal * Time.deltaTime, Space.World);
            }
            else
            {
                shouldMove = false;
                Invoke("StartMoving", delay);

                if (index == targetObject.Length - 1)
                {
                    index = 0;
                }
                else
                {
                    index++;
                }
            }
        }
        
    }

    void StartMoving()
    {
        shouldMove = true;
    }
}
